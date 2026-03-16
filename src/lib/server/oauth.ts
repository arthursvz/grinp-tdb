import { env } from "$env/dynamic/private";
import { ChurrosClient } from "@inp-net/churros-client";

export const churros = new ChurrosClient({
    client_id: "SXMYKbiYioYvmz8w1JB7qhkxLRtsqRyeB8996VCW",
    client_secret: "Bo6aD0SFh7QsyyA4IFDmXp5nofIsqwCRJ4NC8q3uhniEVYmKfnJut0S7239dBsxnA69gqacEuJAUAu2xdYIlithki1ZqCvZ4ks5tYnTDa7pCrSY27v6KhkAcOugJ38JB",
    redirect_uri: "https://grinp.inpt.fr/login"
});

export async function generateState() : Promise<string> {
    return await Math.random().toString(36).slice(2, 15);
}

export async function login(code: string, token: string) : Promise<string> {
    return await churros.getToken(code, token);
}

export async function identity(token: string) {
    const user = await churros.getUserInfo(token);

    return {
        churros_uid: user.uid,
        churros_email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
        ...user
    }
}
