import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  image_url: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

export interface Service {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  base_price: number | null;
  price_unit: string | null;
  icon: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  category?: ServiceCategory;
}

export const useServiceCategories = () => {
  return useQuery({
    queryKey: ["service-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_categories")
        .select("*")
        .eq("is_active", true)
        .order("display_order");
      
      if (error) throw error;
      return data as ServiceCategory[];
    },
  });
};

export const useServices = (categorySlug?: string) => {
  return useQuery({
    queryKey: ["services", categorySlug],
    queryFn: async () => {
      let query = supabase
        .from("services")
        .select(`
          *,
          category:service_categories(*)
        `)
        .eq("is_active", true);

      if (categorySlug) {
        const { data: category } = await supabase
          .from("service_categories")
          .select("id")
          .eq("slug", categorySlug)
          .single();
        
        if (category) {
          query = query.eq("category_id", category.id);
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Service[];
    },
  });
};

export const useService = (serviceId: string) => {
  return useQuery({
    queryKey: ["service", serviceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select(`
          *,
          category:service_categories(*)
        `)
        .eq("id", serviceId)
        .single();
      
      if (error) throw error;
      return data as Service;
    },
    enabled: !!serviceId,
  });
};
