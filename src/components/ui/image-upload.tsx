"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ImagePlus, Trash } from "lucide-react"
import Image from "next/image"
import { CldUploadWidget } from "next-cloudinary"

interface ImageUploadProps {
    disabled?: boolean
    onChange: (value: string[]) => void
    onRemove: (value: string) => void
    value: string[]
}

export default function ImageUpload({
    disabled,
    onChange,
    onRemove,
    value,
}: ImageUploadProps) {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const onUpload = (result: any) => {
        onChange([...value, result.info.secure_url])
    }

    if (!isMounted) {
        return null
    }

    return (
        <div>
            <div className="mb-4 flex items-center gap-4">
                {value.map((url) => (
                    <div
                        key={url}
                        className="relative h-[200px] w-[200px] overflow-hidden rounded-md"
                    >
                        <div className="absolute right-2 top-2 z-10">
                            <Button
                                type="button"
                                onClick={() => onRemove(url)}
                                variant="destructive"
                                size="icon"
                            >
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>
                        <Image
                            fill
                            className="object-cover"
                            alt="Image"
                            src={url}
                        />
                    </div>
                ))}
            </div>
            <CldUploadWidget
                onSuccess={onUpload}
                uploadPreset="unsigned_preset"
                options={{
                    maxFiles: 5
                }}
            >
                {({ open }) => {
                    const onClick = () => {
                        if (open) {
                            open();
                        }
                    }

                    return (
                        <Button
                            type="button"
                            disabled={disabled}
                            variant="secondary"
                            onClick={onClick}
                        >
                            <ImagePlus className="mr-2 h-4 w-4" />
                            Upload Image (Cloudinary)
                        </Button>
                    )
                }}
            </CldUploadWidget>

            {/* Manual URL Input Fallback */}
            <div className="mt-4 flex items-center gap-4">
                <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-2">Or enter an image URL manually (if upload is not configured):</p>
                    <input
                        type="text"
                        placeholder="https://example.com/image.png"
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                const target = e.target as HTMLInputElement;
                                if (target.value) {
                                    onChange([...value, target.value]);
                                    target.value = '';
                                }
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    )
}
