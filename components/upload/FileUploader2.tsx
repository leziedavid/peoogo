"use client";

import React, { HTMLAttributes, useCallback, useEffect, useState } from "react";
import Dropzone, { DropzoneProps, FileRejection } from "react-dropzone";
import { toast } from "sonner";
import Image from "next/image";
import { Upload as IconUpload, X } from "lucide-react";
import { ScrollArea } from "@radix-ui/react-scroll-area";

import { Button } from "../ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// --- Détection mobile simple
const isMobile = () => {
    if (typeof navigator === "undefined") return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
    );
};

interface FileCardProps {
    file: File;
    onRemove: () => void;
    progress?: number;
}

function FileCard({ file, progress, onRemove }: FileCardProps) {
    return (
        <div className="relative flex items-center space-x-4">
            <div className="flex flex-1 space-x-4">
                {isFileWithPreview(file) && (
                    <div className="w-12 h-12 shrink-0 flex items-center justify-center rounded-md overflow-hidden bg-muted">
                        {file.type.startsWith("image/") ? (
                            <Image
                                src={file.preview}
                                alt={file.name}
                                width={48}
                                height={48}
                                loading="lazy"
                                className="aspect-square object-cover"
                            />
                        ) : (
                            <span className="text-muted-foreground text-xs">Fichier</span>
                        )}
                    </div>
                )}
                <div className="flex w-full flex-col gap-2">
                    <div className="space-y-px">
                        <p className="text-foreground/80 line-clamp-1 text-sm font-medium">
                            {file.name}
                        </p>
                        <p className="text-muted-foreground text-xs">{formatBytes(file.size)}</p>
                    </div>
                    {progress !== undefined && <Progress value={progress} />}
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={onRemove}
                    disabled={progress !== undefined && progress < 100}
                    className="size-8 rounded-full"
                >
                    <X className="text-muted-foreground" />
                </Button>
            </div>
        </div>
    );
}

function isFileWithPreview(file: File): file is File & { preview: string } {
    return "preview" in file && typeof file.preview === "string";
}

function formatBytes(size: number): string {
    if (size === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(size) / Math.log(k));
    const value = parseFloat((size / Math.pow(k, i)).toFixed(2));
    return `${value} ${sizes[i]}`;
}

interface FileUploaderProps extends HTMLAttributes<HTMLDivElement> {
    name: string;
    value?: Record<string, File[]>;
    onValueChange?: (name: string, files: File[]) => void;
    onUpload?: (name: string, files: File[]) => Promise<void>;
    progresses?: Record<string, Record<string, number>>;
    accept?: DropzoneProps["accept"];
    maxSize?: number;
    maxFiles?: number;
    multiple?: boolean;
    disabled?: boolean;
}

export function FileUploader({
    name,
    value,
    onValueChange,
    onUpload,
    progresses,
    accept = { "image/*": [] },
    maxSize = 1024 * 1024 * 5,
    maxFiles = 1,
    multiple = false,
    disabled = false,
    className,
    ...dropzoneProps
}: FileUploaderProps) {
    const files = value?.[name] || [];
    const [mobile, setMobile] = useState(false);
    const [choice, setChoice] = useState<"camera" | "gallery" | null>(null);

    useEffect(() => {
        setMobile(isMobile());
        if (isMobile()) {
            const saved = localStorage.getItem("fileUploadChoice") as
                | "camera"
                | "gallery"
                | null;
            if (saved) {
                setChoice(saved);
            }
        }
    }, []);

    const handleChange = (newFiles: File[]) => {
        onValueChange?.(name, newFiles);
    };

    const handleFiles = (selected: FileList | null) => {
        if (!selected) return;
        const accepted = Array.from(selected).map((f) =>
            Object.assign(f, { preview: URL.createObjectURL(f) })
        );
        const updated = [...files, ...accepted];
        handleChange(updated);
        if (onUpload) {
            toast.promise(onUpload(name, updated), {
                loading: "Téléversement...",
                success: "Fichiers uploadés",
                error: "Erreur d’upload",
            });
        }
    };

    const onDrop = useCallback(
        (accepted: File[], rejected: FileRejection[]) => {
            const newFiles = accepted.map((f) =>
                Object.assign(f, { preview: URL.createObjectURL(f) })
            );
            const updated = [...files, ...newFiles];
            handleChange(updated);

            rejected.forEach(({ file }) => {
                toast.error(`Fichier rejeté : ${file.name}`);
            });

            if (onUpload && newFiles.length > 0 && rejected.length === 0) {
                toast.promise(onUpload(name, updated), {
                    loading: "Téléversement...",
                    success: "Fichiers uploadés",
                    error: "Erreur d’upload",
                });
            }
        },
        [files, onUpload, name]
    );

    const onRemove = (index: number) => {
        const updated = files.filter((_, i) => i !== index);
        handleChange(updated);
    };

    useEffect(() => {
        return () => {
            files.forEach((file) => {
                if (isFileWithPreview(file)) {
                    URL.revokeObjectURL(file.preview);
                }
            });
        };
    }, [files]);

    const isDisabled = disabled || files.length >= maxFiles;

    return (
        <div className="relative flex flex-col gap-6 overflow-hidden">
            {mobile ? (
                choice ? (
                    // ✅ Si un choix est déjà enregistré → on ouvre direct le bon input
                    choice === "camera" ? (
                        <label className="cursor-pointer border border-dashed rounded-lg px-5 py-3 text-center">
                            📷 Prendre une photo
                            <input
                                type="file"
                                accept="image/*"
                                capture="environment"
                                className="hidden"
                                onChange={(e) => handleFiles(e.target.files)}
                            />
                        </label>
                    ) : (
                        <label className="cursor-pointer border border-dashed rounded-lg px-5 py-3 text-center">
                            🖼️ Choisir depuis la galerie
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFiles(e.target.files)}
                            />
                        </label>
                    )
                ) : (
                    // ✅ Première fois → on propose les deux choix
                    <div className="flex flex-col items-center gap-4">
                        <label
                            className="cursor-pointer border border-dashed rounded-lg px-5 py-3 text-center"
                            onClick={() => {
                                localStorage.setItem("fileUploadChoice", "camera");
                                setChoice("camera");
                            }}
                        >
                            📷 Prendre une photo
                            <input
                                type="file"
                                accept="image/*"
                                capture="environment"
                                className="hidden"
                                onChange={(e) => handleFiles(e.target.files)}
                            />
                        </label>

                        <label
                            className="cursor-pointer border border-dashed rounded-lg px-5 py-3 text-center"
                            onClick={() => {
                                localStorage.setItem("fileUploadChoice", "gallery");
                                setChoice("gallery");
                            }}
                        >
                            🖼️ Choisir depuis la galerie
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFiles(e.target.files)}
                            />
                        </label>
                    </div>
                )
            ) : (
                <Dropzone
                    onDrop={onDrop}
                    accept={accept}
                    maxSize={maxSize}
                    maxFiles={maxFiles}
                    multiple={multiple}
                    disabled={isDisabled}
                >
                    {({ getRootProps, getInputProps, isDragActive }) => (
                        <div
                            {...getRootProps()}
                            className={cn(
                                "group border-muted-foreground/25 hover:bg-muted/25 relative grid w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed px-5 py-2.5 text-center transition",
                                "ring-offset-background focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2",
                                isDragActive && "border-muted-foreground/50",
                                isDisabled && "pointer-events-none opacity-60",
                                className
                            )}
                            {...dropzoneProps}
                        >
                            <input {...getInputProps()} />
                            <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                                <div className="rounded-full border border-dashed p-3">
                                    <IconUpload className="text-muted-foreground size-7" />
                                </div>
                                <div className="text-center">
                                    <p className="text-muted-foreground font-medium">
                                        Glissez-déposez ou cliquez
                                    </p>
                                    <p className="text-muted-foreground/70 text-sm">
                                        {maxFiles > 1
                                            ? `${maxFiles} fichiers max (${formatBytes(maxSize)} chacun)`
                                            : `1 fichier max (${formatBytes(maxSize)})`}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </Dropzone>
            )}

            {files.length > 0 && (
                <ScrollArea className="h-fit w-full px-3">
                    <div className="max-h-48 space-y-4">
                        {files.map((file, index) => (
                            <FileCard
                                key={index}
                                file={file}
                                onRemove={() => onRemove(index)}
                                progress={progresses?.[name]?.[file.name]}
                            />
                        ))}
                    </div>
                </ScrollArea>
            )}
        </div>
    );
}
