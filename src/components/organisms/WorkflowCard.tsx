
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MoreVertical, GripVertical, Trash2, Plus, Pencil, ArrowRight } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { Workflow, WorkflowStep } from '@/types';
import { useRouter } from 'next/navigation';

// Simple drag and drop implementation
const DraggableStep = ({ step, index, onMove, children }: { step: WorkflowStep, index: number, onMove: (from: number, to: number) => void, children: React.ReactNode }) => {
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData('text/plain', index.toString());
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
        onMove(fromIndex, index);
    };
    
    return (
        <div draggable onDragStart={handleDragStart} onDragOver={handleDragOver} onDrop={handleDrop} className="flex items-center gap-2 group cursor-grab">
            {children}
        </div>
    );
};

interface WorkflowCardProps {
    workflow: Workflow;
    onUpdate: (workflow: Workflow) => void;
    onDelete: (workflowId: string) => void;
}

export function WorkflowCard({ workflow, onUpdate, onDelete }: WorkflowCardProps) {
    const { toast } = useToast();
    const router = useRouter();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isAddStepDialogOpen, setIsAddStepDialogOpen] = useState(false);
    const [newStepName, setNewStepName] = useState('');

    const handleMoveStep = (fromIndex: number, toIndex: number) => {
        const steps = Array.from(workflow.steps);
        const [movedItem] = steps.splice(fromIndex, 1);
        steps.splice(toIndex, 0, movedItem);
        onUpdate({ ...workflow, steps });
    };

    const handleAddStep = () => {
        if (!newStepName.trim()) {
            toast({ variant: 'destructive', title: "Nama langkah tidak boleh kosong." });
            return;
        }
        const templateId = newStepName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const newStep: WorkflowStep = {
            id: `step-${Date.now()}`,
            label: newStepName,
            href: `/buat-surat-kustom?template=${templateId}&label=${encodeURIComponent(newStepName)}`,
        };
        const updatedSteps = [...workflow.steps, newStep];
        onUpdate({ ...workflow, steps: updatedSteps });
        setNewStepName('');
        setIsAddStepDialogOpen(false);
        router.push(newStep.href);
    };

    const handleRemoveStep = (stepId: string) => {
        const updatedSteps = workflow.steps.filter(step => step.id !== stepId);
        onUpdate({ ...workflow, steps: updatedSteps });
        toast({ title: "Langkah Dihapus", description: "Langkah alur kerja telah dihapus." });
    };

    const handleEditStep = (href: string) => {
        router.push(href);
    }

    return (
        <>
            <Card className="flex flex-col">
                <CardHeader className="flex flex-row items-start justify-between">
                    <div>
                        <CardTitle>{workflow.title}</CardTitle>
                        <CardDescription>{workflow.description}</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setIsDeleteDialogOpen(true)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                </CardHeader>
                <CardContent className="flex-grow space-y-2">
                    {workflow.steps.map((step, index) => (
                        <DraggableStep key={step.id} step={step} index={index} onMove={handleMoveStep}>
                             <GripVertical className="h-5 w-5 text-muted-foreground" />
                             <div className="flex-1 p-3 rounded-md border bg-background shadow-sm flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                                        {index + 1}
                                    </div>
                                    <span>{step.label}</span>
                                </div>
                                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleEditStep(step.href)}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleRemoveStep(step.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                             </div>
                        </DraggableStep>
                    ))}
                </CardContent>
                <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => setIsAddStepDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Langkah/Template Baru
                    </Button>
                </CardFooter>
            </Card>

            {/* Add Step Dialog */}
             <Dialog open={isAddStepDialogOpen} onOpenChange={setIsAddStepDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tambah Langkah Baru</DialogTitle>
                        <DialogDescription>Masukkan nama untuk langkah atau template surat baru di alur kerja ini.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-2">
                        <Label htmlFor="step-name">Nama Langkah/Surat</Label>
                        <Input
                            id="step-name"
                            value={newStepName}
                            onChange={(e) => setNewStepName(e.target.value)}
                            placeholder="Contoh: Surat Rekomendasi"
                        />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="secondary">Batal</Button></DialogClose>
                        <Button onClick={handleAddStep}>Buat & Desain Templat</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus alur kerja "{workflow.title}"? Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDelete(workflow.id)} className={buttonVariants({ variant: 'destructive' })}>
                            Ya, Hapus Alur Kerja
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
