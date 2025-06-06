"use client";

import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";

interface FieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  className?: string;
}

export function InputField({ id, label, value, onChange, placeholder, type = "text", required, className }: FieldProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      <Label htmlFor={id} className="text-sm font-medium">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}

export function TextAreaField({ id, label, value, onChange, placeholder, required, className }: FieldProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      <Label htmlFor={id} className="text-sm font-medium">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        rows={3}
      />
    </div>
  );
}

interface ArrayEntryProps<T> {
  entry: T;
  index: number;
  onUpdate: (index: number, field: keyof T, value: any) => void;
  onRemove: (index: number) => void;
  children: (entry: T, index: number, onUpdate: (index: number, field: keyof T, value: any) => void) => React.ReactNode;
  fieldsContainerClassName?: string;
}

export function ArrayEntryField<T extends { id: string }>({ entry, index, onUpdate, onRemove, children, fieldsContainerClassName }: ArrayEntryProps<T>) {
  return (
    <div className="p-4 border rounded-md relative space-y-3 bg-card/50 shadow-sm">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-6 w-6"
        onClick={() => onRemove(index)}
        aria-label="Remove entry"
      >
        <XIcon className="h-4 w-4" />
      </Button>
      <div className={fieldsContainerClassName}>
         {children(entry, index, onUpdate)}
      </div>
    </div>
  );
}
