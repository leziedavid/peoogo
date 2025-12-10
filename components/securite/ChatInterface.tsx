"use client";

import { useEffect, useRef, useState } from "react";
import { Paperclip, Send, X, CornerUpLeft, Edit2, Trash2 } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/useIsMobile";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { createMessage, deleteMessage, getMessagesByUserIdPaginated, updateMessage } from "@/api/services/authService";
import { Message } from "@/types/ApiReponse/MessagesResponse";
import { MessageSkeleton } from "./MessageSkeleton";
import Image from 'next/image';  // Import de Image de Next.js


interface SecuriteProps {
    onClose: () => void;
    isOpen: boolean;
    question: string;
    lastOrderId?: string;
}

export default function ChatInterface({ onClose, isOpen, question, lastOrderId }: SecuriteProps) {

    const isMobile = useIsMobile();
    const [messages, setMessages] = useState<Message[]>([]);

    const [inputMessage, setInputMessage] = useState("");
    const [replyingTo, setReplyingTo] = useState<Message | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [currentMessageId, setCurrentMessageId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    // const [totalItems, setTotalItems] = useState(0);
    const [limit] = useState(10);

    const sortMessagesChronologically = (messages: Message[]) => {
        return [...messages].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    };

    // getAllMessagesByUser;
    const getAllMessagesByUser = async (page: number) => {
        setLoading(true);
        try {
            const res = await getMessagesByUserIdPaginated(page, limit);
            if (res.data) {
                const userMessages = res.data.data;

                const defaultSupportMessage: Message = {
                    id: `welcome-${Date.now()}`, // 👈 ID unique
                    text: `Bonjour! Je vous aide concernant: ${question}`,
                    sender: "support",
                    label: "Nouveau message",
                    senderId: "",
                    timestamp: new Date().toISOString(),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    repliedTo: null,
                    repliedToId: null,
                    lastOrderId: null,
                    imageUrl: null,
                    senderUser: {
                        id: "",
                        name: "support",
                        email: "support@system.com",
                    },
                };

                setMessages(
                    userMessages.length > 0
                        ? sortMessagesChronologically(userMessages)
                        : [defaultSupportMessage]
                );
                // setTotalItems(res.data.total);
                setCurrentPage(res.data.page);
            }
        } catch (err) {
            console.error("Erreur lors du chargement des messages :", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllMessagesByUser(currentPage);
    }, [currentPage]);

    const handleFileSelect = () => fileInputRef.current?.click();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) return alert("Seules les images sont autorisées.");
        setSelectedFile(file);
    };

    const sendToAPI = async (
        text: string,
        orderId?: string,
        repliedToId?: string,
        file?: File,
        messageId?: string) => {

        const formData = new FormData();
        formData.append("text", text);
        if (orderId) formData.append("lastOrderId", orderId);
        if (repliedToId) formData.append("repliedToId", repliedToId);
        formData.append("sender", "user");
        if (file) formData.append("file", file);

        try {
            let data;

            if (messageId) {
                // Mise à jour du message existant
                data = await updateMessage(messageId, formData);
            } else {
                // Création d'un nouveau message
                data = await createMessage(formData);
            }

            // setMessages((prev) => {
            //     if (messageId) {
            //         // Met à jour le message existant
            //         return prev.map((m) =>
            //             m.id === messageId
            //                 ? {
            //                     ...m,
            //                     text: data.text,
            //                     imageUrl: data.imageUrl ?? undefined,
            //                     timestamp: data.updatedAt,
            //                     updatedAt: data.updatedAt,
            //                 }
            //                 : m
            //         );
            //     }

            //     // Ajoute un nouveau message
            //     return [
            //         ...prev,
            //         {
            //             id: data.id,
            //             text: data.text,
            //             sender: data.sender,
            //             senderId: data.senderId,
            //             timestamp: data.createdAt,
            //             createdAt: data.createdAt,
            //             updatedAt: data.updatedAt,
            //             repliedTo: data.repliedTo ?? null,
            //             repliedToId: data.repliedToId ?? null,
            //             lastOrderId: data.lastOrderId ?? null,
            //             imageUrl: data.imageUrl ?? undefined,
            //             senderUser: data.senderUser ?? undefined,
            //         },
            //     ];

            // });

            // Réinitialisation des états

            // 🔁 Recharge proprement après modification
            await getAllMessagesByUser(currentPage);

            setInputMessage("");
            setReplyingTo(null);
            setSelectedFile(null);
            setCurrentMessageId(null);

        } catch (err) {
            console.error("Erreur lors de l'envoi du message :", err);
        }

    };

    const handleSendMessage = () => {
        if (!inputMessage.trim() && !selectedFile) return;
        sendToAPI(
            inputMessage.trim(),
            lastOrderId,
            replyingTo?.id,
            selectedFile ?? undefined,
            currentMessageId ?? undefined
        );
    };

    const handleDeleteMessage = async (id: string) => {
        const res = await deleteMessage(id);
        if (res.statusCode === 200) {
            getAllMessagesByUser(currentPage);
        }
    };

    const handleReply = (message: Message) => setReplyingTo(message);
    const formatTime = (timestamp: string | Date) => new Date(timestamp).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                onDragEnd={(e, info) => info.point.y > 100 && onClose()}
                className="fixed bottom-0 inset-x-0 z-50 bg-white rounded-t-2xl shadow-xl max-h-[90vh] overflow-y-auto sm:hidden" >

                <SheetContent side={isMobile ? "bottom" : "left"} className={isMobile ? "h-[90%] overflow-y-auto" : "w-[400px] max-h-screen overflow-y-auto"}>
                    <div className="w-10 h-1.5 bg-gray-300 rounded-full mx-auto my-2" />
                    <div className="bg-white min-h-screen w-full">
                        <div className="max-w-sm mx-auto">
                            <div className="flex items-center justify-between p-4 border-b">
                                <h1 className="text-2xl font-light">{question} </h1>
                            </div>

                            <div className="p-4 space-y-4 bg-gray-50">

                                {loading ? (
                                    <>
                                        <MessageSkeleton />
                                        <MessageSkeleton />
                                    </>
                                ) : (
                                    messages.map((message) => (
                                        <div key={`${message.id}-${message.timestamp}`} className="flex justify-start">
                                            <div className={`relative ml-auto max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.sender === 'user' ? 'bg-gray-200 text-black' : 'bg-white text-gray-800 border'}`} >

                                                {message.repliedTo && (
                                                    <div className="text-xs p-2 rounded mb-2 border-l-3 bg-gray-30 border-gray-300 font-bold">
                                                        <p className="font-medium text-xs opacity-75">
                                                            {message.repliedTo.sender === 'user' ? 'Vous' : 'support'}
                                                        </p>
                                                        <p className="text-xs opacity-75 truncate max-w-[200px]">
                                                            {message.repliedTo.text || 'Image'}
                                                        </p>
                                                    </div>
                                                )}
                                                <div>
                                                    {message.text && (
                                                        <p className="text-sm whitespace-pre-line">{message.text}</p>
                                                    )}
                                                    {message.imageUrl && (
                                                        <div className="relative mt-2 w-full max-w-xs lg:max-w-md h-48">
                                                            <Image
                                                                src={message.imageUrl}
                                                                alt="Pièce jointe"
                                                                fill
                                                                className="object-contain rounded-md" unoptimized
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="flex items-center justify-between mt-1 gap-2">
                                                        <span className="text-xs text-black/80">
                                                            {formatTime(message.timestamp)}
                                                        </span>

                                                        <div className="flex gap-1">
                                                            <button onClick={() => handleReply(message)}>
                                                                <CornerUpLeft className="w-4 h-4 text-gray-500" />
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setInputMessage(message.text ?? '');
                                                                    setCurrentMessageId(message.id);
                                                                    setReplyingTo(null);
                                                                    setSelectedFile(null);
                                                                }}
                                                            >
                                                                <Edit2 className="w-4 h-4 text-blue-500" />
                                                            </button>
                                                            <button onClick={() => handleDeleteMessage(message.id)}>
                                                                <Trash2 className="w-4 h-4 text-red-500" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}

                            </div>

                            {replyingTo && (
                                <div className="px-4 py-2 bg-gray-100 border-t">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1">
                                            <p className="text-xs font-medium text-gray-600">Réponse à {replyingTo.sender === 'user' ? 'Vous' : 'support'}</p>
                                            <p className="text-sm text-gray-800 break-words max-w-full">{replyingTo.text || 'Image'}</p>
                                        </div>
                                        <button onClick={() => setReplyingTo(null)} className="p-1">
                                            <X className="h-4 w-4 text-gray-500" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="p-4 border-t bg-white">
                                <div className="flex items-end gap-2">
                                    <button onClick={handleFileSelect} className="p-2 text-gray-500 hover:text-gray-700">
                                        <Paperclip className="h-5 w-5" />
                                    </button>
                                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                                    <Textarea
                                        value={inputMessage}
                                        onChange={(e) => setInputMessage(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }
                                        }}
                                        placeholder="Tapez votre message..."
                                        className="flex-1 resize-none rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500"
                                        rows={1}
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={!inputMessage.trim() && !selectedFile}
                                        className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed" >
                                        <Send className="h-5 w-5" />
                                    </button>
                                </div>
                                {selectedFile && (
                                    <div className="relative mt-2 w-24 h-24">
                                        <Image
                                            src={URL.createObjectURL(selectedFile)}
                                            alt="Aperçu"
                                            fill
                                            className="object-cover rounded-md" unoptimized
                                        />
                                        <button
                                            onClick={() => setSelectedFile(null)}
                                            className="absolute top-0 right-0 bg-white rounded-full p-1 shadow"
                                        >
                                            <X className="w-4 h-4 text-gray-700" />
                                        </button>
                                    </div>
                                )}


                            </div>

                        </div>
                    </div>
                </SheetContent>

            </motion.div>
        </Sheet>
    );
}
