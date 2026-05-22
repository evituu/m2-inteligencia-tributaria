"use client";

import { NavigationMenu } from "@/components/layout/navigation-menu";
import { Footer } from "@/components/layout/Footer";
import { AdminShell } from "../../_components/AdminShell";
import { AlbumEditorForm } from "../../_components/AlbumEditorForm";

export default function AdminAlbumCreatePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#04070d]">
      <NavigationMenu />
      <div className="flex-1 pt-22">
        <AdminShell
          title="Novo album"
          subtitle="Defina titulo, banner e envie as fotos do evento."
        >
          <AlbumEditorForm mode="create" />
        </AdminShell>
      </div>
      <Footer />
    </div>
  );
}
