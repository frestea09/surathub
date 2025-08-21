
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { FileSignature, FileText, PlusCircle, ChevronLeft, Package, Pill, Receipt, CheckCircle, ArrowRight, Circle, Building2, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useSuratStore } from "@/store/suratStore"
import type { Workflow, WorkflowStep } from "@/types"

const iconMapping: { [key: string]: React.ElementType } = {
    "pengadaan": Package,
    "obat": Pill,
    "personalia": User,
    "default": FileText,
};

const getIconForTitle = (title: string): React.ElementType => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("obat") || lowerTitle.includes("farmasi")) return iconMapping.obat;
    if (lowerTitle.includes("pengadaan") || lowerTitle.includes("umum")) return iconMapping.pengadaan;
    if (lowerTitle.includes("personalia") || lowerTitle.includes("sdm")) return iconMapping.personalia;
    return iconMapping.default;
};


const MainMenu = ({ workflows, setView }: { workflows: Workflow[], setView: (view: string) => void }) => (
    <div className="p-2 space-y-2">
        <h3 className="px-2 text-sm font-semibold text-muted-foreground">Pilih Jenis Alur Kerja</h3>
        {workflows.map(wf => {
            const Icon = getIconForTitle(wf.title);
            return (
                 <Button key={wf.id} variant="ghost" className="w-full justify-start h-12" onClick={() => setView(wf.id)}>
                    <Icon className="mr-3 h-5 w-5" />
                    <div>
                        <p className="text-base">{wf.title}</p>
                        <p className="text-xs text-muted-foreground text-left">{wf.description}</p>
                    </div>
                </Button>
            )
        })}
    </div>
);

const StepIcon = ({ step }: { step: number }) => (
    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
        {step}
    </div>
);

const WorkflowMenu = ({
    workflow,
    onBack,
    onSelect
}: {
    workflow: Workflow,
    onBack: () => void,
    onSelect: (href: string) => void
}) => {
    return (
        <div>
            <div className="p-2 flex items-center border-b">
                 <Button variant="ghost" size="icon" className="h-8 w-8 mr-2" onClick={onBack}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <h3 className="text-sm font-semibold">{workflow.title}</h3>
            </div>
            <div className="p-2">
                <p className="text-xs text-muted-foreground px-2 mb-2">Pilih langkah alur kerja yang ingin Anda mulai.</p>
                <div className="space-y-1">
                    {workflow.steps.map((item, index) => (
                        <div key={item.href}>
                             <Button
                                variant="ghost"
                                className="w-full justify-start h-11"
                                onClick={() => onSelect(item.href)}
                            >
                                <StepIcon step={index + 1} />
                                <span className="ml-3 text-left">{item.label}</span>
                            </Button>
                            {index < workflow.steps.length - 1 && (
                                <div className="ml-3 my-1 border-l-2 border-dashed border-border h-4" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


export function BuatSuratButton() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [view, setView] = React.useState<string>('main');
  const { workflows, fetchWorkflows } = useSuratStore();

  React.useEffect(() => {
    fetchWorkflows();
  }, [fetchWorkflows]);

  React.useEffect(() => {
      if (open) {
          setView('main');
      }
  }, [open]);

  const handleSelect = (href: string) => {
    router.push(href)
    setOpen(false)
  }

  const handleBack = () => {
      setView('main');
  }

  const selectedWorkflow = workflows.find(wf => wf.id === view);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Buat Surat Baru
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0" align="end">
        {view === 'main' ? (
            <MainMenu workflows={workflows} setView={setView} />
        ) : selectedWorkflow ? (
            <WorkflowMenu
                workflow={selectedWorkflow}
                onBack={handleBack}
                onSelect={handleSelect}
            />
        ) : null}
      </PopoverContent>
    </Popover>
  )
}
