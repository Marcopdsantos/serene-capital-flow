import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import logo from "@/assets/logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Authentication logic will be implemented with Lovable Cloud
    console.log("Login attempt:", { email });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <Link to="/">
            <img src={logo} alt="Acordo Capital" className="h-12 mx-auto" />
          </Link>
          <h1 className="text-3xl font-bold">Bem-vindo de volta</h1>
          <p className="text-muted-foreground">
            Acesse sua conta para continuar
          </p>
        </div>

        <Card className="shadow-editorial">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Entre com suas credenciais para acessar a plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <a href="#" className="text-primary hover:underline">
                  Esqueceu sua senha?
                </a>
              </div>

              <Button type="submit" className="w-full font-sans">
                Entrar
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Ainda não tem uma conta?{" "}
                <a href="#" className="text-primary hover:underline font-medium">
                  Entre em contato
                </a>
              </p>
            </form>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Voltar para home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
