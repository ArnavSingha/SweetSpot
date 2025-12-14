'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { registerSchema } from '@/lib/validation/userSchemas';
import { useEffect, useState, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { register } from '@/lib/actions/auth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

type RegisterFormValues = z.infer<typeof registerSchema>;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Creating Account...' : 'Create Account'}
    </Button>
  );
}

export function RegisterForm() {
  const { toast } = useToast();
  const [state, formAction] = useActionState(register, { success: false });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onTouched', // Validate on blur
  });

  useEffect(() => {
    if (state.issues) {
      for (const [field, issues] of Object.entries(state.issues)) {
        form.setError(field as keyof RegisterFormValues, {
          type: 'server',
          message: issues.join(', '),
        });
      }
    }
    if (state.success) {
       toast({
          title: 'Account Created',
          description: 'Welcome! You have been successfully registered.',
        });
    }
  }, [state, form, toast]);


  return (
    <Form {...form}>
      <form action={formAction} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="m@example.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                    <Input type={showPassword ? 'text' : 'password'} placeholder="••••••••" {...field} />
                     <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                        onClick={() => setShowPassword((prev) => !prev)}
                        >
                        {showPassword ? <EyeOff /> : <Eye />}
                        <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
                    </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                 <div className="relative">
                    <Input type={showConfirmPassword ? 'text' : 'password'} placeholder="••••••••" {...field} />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        >
                        {showConfirmPassword ? <EyeOff /> : <Eye />}
                        <span className="sr-only">{showConfirmPassword ? 'Hide password' : 'Show password'}</span>
                    </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {state.error && !state.issues && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}
        
        <SubmitButton />
      </form>
    </Form>
  );
}
