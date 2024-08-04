import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { ReloadIcon } from '@radix-ui/react-icons';
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signup } from "@/api";
import { useToast } from "../ui/use-toast";
import { useAuth } from "@/context/auth-context";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  confirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters long"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // Path of the error
});

type FormValues = z.infer<typeof schema>;

export function SignUp() {
  const {toast} = useToast();
  const navigate = useNavigate();
  const {signin: authenticate} = useAuth();

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: FormValues) {
    setIsLoading(true)

    try {
      const response = await signup({username: data.email, password: data.password});
      authenticate(response.access_token);
      toast({
        title: "Sign Up successfully"
      })
      navigate("/");
    } catch {
      toast({
        variant: "destructive",
        title: "Sign Up failed",
        description: "The email is already in use",
      })
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Link
        to="/signin"
        className={ cn(
          buttonVariants({variant: "ghost"}),
          "absolute right-4 top-4 md:right-8 md:top-8"
        ) }
      >
        Sign In
      </Link>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create an account
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email below to create your account
        </p>
      </div>
      <div className="grid gap-6">
        <form onSubmit={ handleSubmit(onSubmit) }>
          <div className="grid gap-5">
            <div className="grid gap-1">
              <Label htmlFor="email">Email</Label>
              <Controller
                name="email"
                control={ control }
                render={ ({field}) => (
                  <Input
                    id="email"
                    placeholder="name@example.com"
                    type="email"
                    disabled={ isLoading }
                    { ...field }
                  />
                ) }
              />
              { errors.email && <p className="text-red-500">{ errors.email.message }</p> }
            </div>
            <div className="grid gap-1">
              <Label htmlFor="password">Password</Label>
              <Controller
                name="password"
                control={ control }
                render={ ({field}) => (
                  <Input
                    id="password"
                    placeholder="Password"
                    type="password"
                    disabled={ isLoading }
                    { ...field }
                  />
                ) }
              />
              { errors.password && <p className="text-red-500">{ errors.password.message }</p> }
            </div>
            <div className="grid gap-1">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Controller
                name="confirmPassword"
                control={ control }
                render={ ({field}) => (
                  <Input
                    id="confirm-password"
                    placeholder="Confirm Password"
                    type="password"
                    disabled={ isLoading }
                    { ...field }
                  />
                ) }
              />
              { errors.confirmPassword && <p className="text-red-500">{ errors.confirmPassword.message }</p> }
            </div>
            <Button type="submit" disabled={ isLoading }>
              { isLoading && (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin"/>
              ) }
              Create Account
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}