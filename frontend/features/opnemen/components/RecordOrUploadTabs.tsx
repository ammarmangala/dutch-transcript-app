"use client";

import { AppIcon } from "@/components/app/AppIcon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AudioRecorder from "./AudioRecorder";
import AudioUploader from "./AudioUploader";

interface Props {
  onAudio: (blob: Blob, filename: string) => void;
}

export default function RecordOrUploadTabs({ onAudio }: Props) {
  function handleFile(file: File) {
    onAudio(file, file.name);
  }

  return (
    <Tabs className="w-full" defaultValue="opnemen">
      <TabsList className="mb-4 grid h-auto w-full grid-cols-2 rounded-lg border border-border bg-muted/35 p-1">
        <TabsTrigger className="h-8 gap-2" value="opnemen">
          <AppIcon name="mic" />
          Opnemen
        </TabsTrigger>
        <TabsTrigger className="h-8 gap-2" value="uploaden">
          <AppIcon name="upload" />
          Uploaden
        </TabsTrigger>
      </TabsList>

      <TabsContent className="mt-0" value="opnemen">
        <AudioRecorder onBlob={onAudio} />
      </TabsContent>

      <TabsContent className="mt-0" value="uploaden">
        <AudioUploader onFile={handleFile} />
      </TabsContent>
    </Tabs>
  );
}
