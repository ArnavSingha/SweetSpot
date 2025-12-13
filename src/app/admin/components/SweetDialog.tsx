'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { type ReactNode, useState } from 'react';

type SweetDialogProps = {
  trigger: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
};

export function SweetDialog({
  trigger,
  title,
  description,
  children,
}: SweetDialogProps) {
  const [open, setOpen] = useState(false);

  // By passing `onSuccess` to the child form and calling it,
  // we can close the dialog from the form component.
  const childrenWithProps = Array.isArray(children)
    ? children.map((child) =>
        child
          ? // @ts-ignore
            { ...child, props: { ...child.props, onSuccess: () => setOpen(false) } }
          : child
      )
    : // @ts-ignore
      { ...children, props: { ...children.props, onSuccess: () => setOpen(false) } };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="py-4">
            {childrenWithProps}
        </div>
      </DialogContent>
    </Dialog>
  );
}
