
"use client";

import React, { useState, useEffect } from 'react';
import { AppLayout } from "@/components/templates/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useSuratStore } from '@/store/suratStore';
import { WorkflowCard } from '@/components/organisms/WorkflowCard';
import type { Workflow } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

const WorkflowPageSkeleton = () => (
    <>
        <div className="flex items-center justify-between">
            <div className="space-y-1">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96" />
            </div>
            <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/4" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/4" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
        </div>
    </>
);

export default function AlurKerjaPage() {
    const { workflows, fetchWorkflows, updateWorkflows, isLoading } = useSuratStore();

    useEffect(() => {
        fetchWorkflows();
    }, [fetchWorkflows]);

    const handleUpdate = (updatedWorkflow: Workflow) => {
        const updatedList = workflows.map(wf =>
            wf.id === updatedWorkflow.id ? updatedWorkflow : wf
        );
        updateWorkflows(updatedList);
    };

    const handleAddWorkflow = () => {
        const newWorkflow: Workflow = {
            id: `wf-${Date.now()}`,
            title: "Alur Baru (Tanpa Judul)",
            description: "Alur baru yang dibuat oleh pengguna",
            steps: [],
        };
        updateWorkflows([...workflows, newWorkflow]);
    };

    const handleDeleteWorkflow = (workflowId: string) => {
        const updatedList = workflows.filter(wf => wf.id !== workflowId);
        updateWorkflows(updatedList);
    };

    if (isLoading) {
        return (
             <AppLayout>
                <WorkflowPageSkeleton />
            </AppLayout>
        )
    }

    return (
        <AppLayout>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold md:text-2xl">Pengelola Alur Kerja</h1>
                    <p className="text-sm text-muted-foreground">
                        Sesuaikan alur dan templat surat sesuai kebutuhan Anda.
                    </p>
                </div>
                <Button onClick={handleAddWorkflow}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Tambah Alur Baru
                </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
                {workflows.map((workflow) => (
                    <WorkflowCard
                        key={workflow.id}
                        workflow={workflow}
                        onUpdate={handleUpdate}
                        onDelete={handleDeleteWorkflow}
                    />
                ))}
            </div>
        </AppLayout>
    );
}
