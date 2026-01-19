const load = async (event) => {
  return {
    user: event.locals.user
  };
};
export {
  load
};
