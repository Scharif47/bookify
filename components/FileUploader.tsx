"use client";

import { useId, useRef } from "react";
import { X } from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BookUploadFormValues, FileUploadFieldProps } from "@/types";

function FileUploader({
  control,
  name,
  label,
  acceptTypes,
  disabled,
  icon: Icon,
  placeholder,
  hint,
}: Readonly<FileUploadFieldProps<BookUploadFormValues>>) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, ref, name: fieldName, value } }) => (
        <FormItem>
          <FormLabel className="form-label">{label}</FormLabel>
          <FormControl>
            <div className="space-y-2">
              <label
                htmlFor={inputId}
                className={`upload-dropzone ${value instanceof File ? "upload-dropzone-uploaded" : ""}`}
              >
                <Icon className="upload-dropzone-icon" aria-hidden="true" />
                {value instanceof File ? (
                  <div className="flex items-center gap-2">
                    <p className="upload-dropzone-text">{value.name}</p>
                    <button
                      type="button"
                      aria-label="Remove selected file"
                      className="upload-dropzone-remove"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        onChange(undefined);
                        if (inputRef.current) {
                          inputRef.current.value = "";
                        }
                      }}
                      disabled={disabled}
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ) : (
                  <p className="upload-dropzone-text">{placeholder}</p>
                )}
                <p className="upload-dropzone-hint">{hint}</p>
              </label>
              <Input
                id={inputId}
                type="file"
                accept={acceptTypes.join(",")}
                disabled={disabled}
                onChange={(event) => onChange(event.target.files?.[0])}
                className="sr-only"
                name={fieldName}
                onBlur={onBlur}
                ref={(element) => {
                  ref(element);
                  inputRef.current = element;
                }}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default FileUploader;
