import { r as redirect } from "../../../../chunks/server.js";
const load = async (event) => {
  if (!event.locals.user) {
    redirect(
      302,
      "/login"
      /*{
        type: "error",
        message: "Vous devez être connecté pour accéder à cette page !",
      },
      event,*/
    );
  }
};
export {
  load
};
