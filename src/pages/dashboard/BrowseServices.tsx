import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useServices, useServiceCategories } from "@/hooks/useServices";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Filter,
  IndianRupee,
  ArrowRight,
  Wrench,
  Zap,
  Home,
  Truck,
  UtensilsCrossed,
  Users,
  Building2,
  GraduationCap,
  Tractor,
  Recycle,
  Printer,
  AlertTriangle,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  AlertTriangle,
  Wrench,
  Home,
  Printer,
  Car: Truck,
  UtensilsCrossed,
  Building: Building2,
  HardHat: Users,
  GraduationCap,
  Tractor,
  Recycle,
  Zap,
};

const BrowseServices = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") || "";
  const [searchQuery, setSearchQuery] = useState("");

  const { data: categories, isLoading: categoriesLoading } = useServiceCategories();
  const { data: services, isLoading: servicesLoading } = useServices(selectedCategory || undefined);

  const filteredServices = services?.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCategoryClick = (slug: string) => {
    if (slug === selectedCategory) {
      searchParams.delete("category");
    } else {
      searchParams.set("category", slug);
    }
    setSearchParams(searchParams);
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
          Browse Services
        </h1>
        <p className="text-muted-foreground mt-1">
          Find and book the services you need
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search services..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h2 className="text-sm font-medium text-muted-foreground mb-3">Categories</h2>
        <div className="flex flex-wrap gap-2">
          {categoriesLoading ? (
            <>
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-8 w-24" />
              ))}
            </>
          ) : (
            <>
              <Button
                variant={selectedCategory === "" ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryClick("")}
              >
                All
              </Button>
              {categories?.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.slug ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryClick(category.slug)}
                >
                  {category.name}
                </Button>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {servicesLoading ? (
          <>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </>
        ) : filteredServices?.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No services found</p>
          </div>
        ) : (
          filteredServices?.map((service) => {
            const Icon = iconMap[service.icon || ""] || Wrench;
            return (
              <Card key={service.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    {service.category && (
                      <Badge variant="secondary" className="text-xs">
                        {service.category.name}
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">
                    {service.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-foreground font-medium">
                      <IndianRupee className="w-4 h-4" />
                      <span>
                        {service.base_price === 0 ? "Free" : service.base_price}
                      </span>
                      <span className="text-xs text-muted-foreground ml-1">
                        /{service.price_unit}
                      </span>
                    </div>
                    <Link to={`/dashboard/book/${service.id}`}>
                      <Button size="sm">
                        Book <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </DashboardLayout>
  );
};

export default BrowseServices;
