export default async (_request, context) => {
  const token = context.cookies.get("token");
  if (token == "badpassword") return undefined;
  return new Response("Access denied", {
    status: 403
  })
}
