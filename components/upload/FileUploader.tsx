"use client"

import React, { HTMLAttributes, useCallback, useEffect } from "react";
import Dropzone, { DropzoneProps, FileRejection } from "react-dropzone";
import { toast } from "sonner";
import Image from "next/image";
import { Upload as IconUpload, X } from "lucide-react";
import { ScrollArea } from "@radix-ui/react-scroll-area";

import { Button } from "../ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface FileCardProps {
    file: File;
    onRemove: () => void;
    progress?: number;
}

const ExcelIcon = () => (
    <div className="bg-green-100 p-2 rounded">
        <svg className="w-10 h-10 text-green-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 2H8a2 2 0 00-2 2v3h2V4h11v16H8v-3H6v3a2 2 0 002 2h11a2 2 0 002-2V4a2 2 0 00-2-2z" />
            <path d="M10 14l1.5-2L10 10h1.5l1 1.5 1-1.5H15l-1.5 2L15 14h-1.5l-1-1.5-1 1.5H10z" />
        </svg>
    </div>
);

const PdfIcon = () => (
    <div className="bg-red-100 p-2 rounded">
        <svg className="w-10 h-10 text-red-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
            <path d="M9 13h1.5v4H9zM13.5 13H15v4h-1.5z" />
        </svg>
    </div>
);


function FileCard({ file, progress, onRemove }: FileCardProps) {
    return (
        <div className="relative flex items-center space-x-4">
            <div className="flex flex-1 space-x-4">
                {isFileWithPreview(file) && (

                    // <Image src={file.preview} alt={file.name} width={48} height={48} loading="lazy" className="aspect-square shrink-0 rounded-md object-cover" />

                    <div className="w-12 h-12 shrink-0 flex items-center justify-center rounded-md overflow-hidden bg-muted">
                        {file.type.startsWith('image/') && isFileWithPreview(file) ? (
                            <Image
                                src={file.preview}
                                alt={file.name}
                                width={48}
                                height={48}
                                loading="lazy"
                                className="aspect-square object-cover"
                            />
                        ) : file.type === 'application/pdf' ? (
                            <PdfIcon />
                        ) : file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ? (
                            <ExcelIcon />
                        ) : (
                            <span className="text-muted-foreground text-xs">Fichier</span>
                        )}
                    </div>

                )}
                <div className="flex w-full flex-col gap-2">
                    <div className="space-y-px">
                        <p className="text-foreground/80 line-clamp-1 text-sm font-medium">{file.name}</p>
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
                    <span className="sr-only">Remove file</span>
                </Button>
            </div>
        </div>
    );
}

function isFileWithPreview(file: File): file is File & { preview: string } {
    return 'preview' in file && typeof file.preview === 'string';
}

function formatBytes(size: number): string {
    if (size === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
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
    accept?: DropzoneProps['accept'];
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
    // accept = { 'image/*': [] },
    accept = {
        'image/*': [],
        'application/pdf': [],
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [],
    },
    maxSize = 1024 * 1024 * 10, // 10MB
    maxFiles = 3,
    multiple = false,
    disabled = false,
    className,
    ...dropzoneProps
}: FileUploaderProps) {
    const files = value?.[name] || [];

    const handleChange = (newFiles: File[]) => {
        onValueChange?.(name, newFiles);
    };

    const onDrop = useCallback(
        (accepted: File[], rejected: FileRejection[]) => {
            if (!multiple && maxFiles === 1 && accepted.length > 1) {
                toast.error('Un seul fichier est autorisé');
                return;
            }

            if (files.length + accepted.length > maxFiles) {
                toast.error(`Maximum ${maxFiles} fichiers`);
                return;
            }

            const newFiles = accepted.map((f) =>
                Object.assign(f, { preview: URL.createObjectURL(f) })
            );

            const updated = [...files, ...newFiles];
            handleChange(updated);

            // Rejeter immédiatement les fichiers non valides
            rejected.forEach(({ file }) => {
                toast.error(`Fichier rejeté car la taille est trop grande : ${file.name}`);
            });

            // ✅ Ne lancer l’upload que s’il y a des fichiers acceptés et AUCUN rejeté
            if (onUpload && newFiles.length > 0 && rejected.length === 0 && updated.length <= maxFiles) {
                toast.promise(onUpload(name, updated), {
                    loading: 'Téléversement...',
                    success: 'Fichiers uploadés',
                    error: 'Erreur d’upload',
                });
            }
        },
        [files, maxFiles, multiple, onUpload, name]
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
            <Dropzone onDrop={onDrop} accept={accept} maxSize={maxSize} maxFiles={maxFiles} multiple={multiple} disabled={isDisabled} >

                {({ getRootProps, getInputProps, isDragActive }) => (
                    <div {...getRootProps()} className={cn('group border-muted-foreground/25 hover:bg-muted/25 relative grid  w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed px-5 py-2.5 text-center transition', 'ring-offset-background focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2', isDragActive && 'border-muted-foreground/50', isDisabled && 'pointer-events-none opacity-60', className)} {...dropzoneProps} >
                        <input {...getInputProps()} />
                        <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                            <div className="rounded-full border border-dashed p-3">
                                <IconUpload className="text-muted-foreground size-7" />
                            </div>
                            <div className="text-center">
                                <p className="text-muted-foreground font-medium">Glissez-déposez ou cliquez</p>
                                <p className="text-muted-foreground/70 text-sm">
                                    {maxFiles > 1 ? `${maxFiles} fichiers max (${formatBytes(maxSize)} chacun)` : `1 fichier max (${formatBytes(maxSize)})`}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </Dropzone>

            {files.length > 0 && (
                <ScrollArea className="h-fit w-full px-3">
                    <div className="max-h-48 space-y-4">
                        {files.map((file, index) => (
                            <FileCard key={index} file={file} onRemove={() => onRemove(index)} progress={progresses?.[name]?.[file.name]} />
                        ))}
                    </div>
                </ScrollArea>
            )}
        </div>
    );
}
