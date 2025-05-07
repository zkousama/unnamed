// File: src/components/AuthForms.tsx
import { useState } from "react";
import { signInSchema, signUpSchema } from "@/lib/schemas";
import { signIn, signUp } from "@/lib/auth-client";
import { useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";

type SignInFormValues = z.infer<typeof signInSchema>;
type SignUpFormValues = z.infer<typeof signUpSchema>;

export function SignInForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignInFormValues>({
    email: "",
    password: "",
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const signInMutation = useMutation({
    mutationFn: async (data: SignInFormValues) => {
      const result = await signIn.email(data);
      if (result.error) throw new Error(result.error.message);
      return result.data;
    },
    onSuccess: () => navigate({ to: "/dashboard" }),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear validation error when user starts typing again
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      // Validate form data
      const validatedData = signInSchema.parse(formData);
      setValidationErrors({});
      signInMutation.mutate(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0].toString()] = err.message;
          }
        });
        setValidationErrors(errors);
      }
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Enter your email and password to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="email@example.com"
              value={formData.email}
              onChange={handleChange}
            />
            {validationErrors.email && (
              <p className="text-sm font-medium text-destructive">{validationErrors.email}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />
            {validationErrors.password && (
              <p className="text-sm font-medium text-destructive">{validationErrors.password}</p>
            )}
          </div>
          
          {signInMutation.isError && (
            <Alert variant="destructive">
              <AlertDescription>
                {signInMutation.error?.message || "Failed to sign in. Please check your credentials."}
              </AlertDescription>
            </Alert>
          )}
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={signInMutation.isPending}
          >
            {signInMutation.isPending ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function SignUpForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignUpFormValues>({
    name: "",
    email: "",
    password: "",
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const signUpMutation = useMutation({
    mutationFn: async (data: SignUpFormValues) => {
      const result = await signUp.email(data);
      if (result.error) throw new Error(result.error.message);
      return result.data;
    },
    onSuccess: () => navigate({ to: "/dashboard" }),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear validation error when user starts typing again
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      // Validate form data
      const validatedData = signUpSchema.parse(formData);
      setValidationErrors({});
      signUpMutation.mutate(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0].toString()] = err.message;
          }
        });
        setValidationErrors(errors);
      }
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your details to create a new account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
            />
            {validationErrors.name && (
              <p className="text-sm font-medium text-destructive">{validationErrors.name}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="email@example.com"
              value={formData.email}
              onChange={handleChange}
            />
            {validationErrors.email && (
              <p className="text-sm font-medium text-destructive">{validationErrors.email}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />
            {validationErrors.password && (
              <p className="text-sm font-medium text-destructive">{validationErrors.password}</p>
            )}
          </div>
          
          {signUpMutation.isError && (
            <Alert variant="destructive">
              <AlertDescription>
                {signUpMutation.error?.message || "Failed to create account. Please try again."}
              </AlertDescription>
            </Alert>
          )}
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={signUpMutation.isPending}
          >
            {signUpMutation.isPending ? "Creating account..." : "Sign Up"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}