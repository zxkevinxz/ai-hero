/**
 * Matt here!
 *
 * I have a weird WSL setup which means I have occasional
 * trouble connecting to localhost. So, this is a me-only
 * workaround.
 */
export const getLocalhost = () => {
  return process.env.LOCALHOST_OVERRIDE || "localhost";
};
