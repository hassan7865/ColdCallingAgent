export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
};

const resourceFactory = (name: string) => ({
  all: [name] as const,
  list: (params: Record<string, unknown> = {}) => [name, "list", params] as const,
  detail: (id: string) => [name, "detail", id] as const,
});

export const prospectsKeys = resourceFactory("prospects");
export const campaignsKeys = resourceFactory("campaigns");
export const reportsKeys = resourceFactory("reports");
