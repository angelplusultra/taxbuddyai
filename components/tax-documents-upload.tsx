import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { UploadedFile } from "@/app/page";

const TaxDocumentUpload: React.FC<{
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
  uploadedFiles: UploadedFile[];
}> = ({ setUploadedFiles, uploadedFiles }) => {

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file) => ({
        id: crypto.randomUUID(),
        file,
        type: detectDocumentType(file.name),
        status: "uploading" as const,
        progress: 0,
      }));
      const simulateUpload = (fileId: string) => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 30;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setUploadedFiles((prev) =>
              prev.map((file) =>
                file.id === fileId
                  ? { ...file, status: "completed", progress: 100 }
                  : file
              )
            );
          } else {
            setUploadedFiles((prev) =>
              prev.map((file) =>
                file.id === fileId ? { ...file, progress } : file
              )
            );
          }
        }, 100);
      };

      setUploadedFiles((prev) => [...prev, ...newFiles]);

      // Simulate upload progress
      newFiles.forEach((uploadFile) => {
        simulateUpload(uploadFile.id);
      });
    },
    [setUploadedFiles]
  );

  const detectDocumentType = (filename: string): UploadedFile["type"] => {
    const lower = filename.toLowerCase();
    if (lower.includes("w2") || lower.includes("w-2")) return "w2";
    if (lower.includes("1099") && lower.includes("int")) return "1099-int";
    if (lower.includes("1099") && lower.includes("nec")) return "1099-nec";
    return "other";
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    multiple: true,
  });

  const getDocumentTypeInfo = (type: UploadedFile["type"]) => {
    switch (type) {
      case "w2":
        return { label: "W-2", color: "bg-primary text-primary-foreground" };
      case "1099-int":
        return { label: "1099-INT", color: "bg-accent text-accent-foreground" };
      case "1099-nec":
        return {
          label: "1099-NEC",
          color: "bg-secondary text-secondary-foreground",
        };
      default:
        return { label: "Other", color: "bg-muted text-muted-foreground" };
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Tax Documents
        </CardTitle>
        <CardDescription>
          Upload your W-2, 1099-INT, 1099-NEC, and other tax documents.
          Supported formats: PDF, PNG, JPG
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-muted/50"
            }
          `}
        >
          <input {...getInputProps()} />
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            {isDragActive ? (
              <p className="text-primary font-medium">
                Drop your tax documents here...
              </p>
            ) : (
              <div className="space-y-2">
                <p className="text-foreground font-medium">
                  Drag & drop your tax documents here, or click to browse
                </p>
                <p className="text-muted-foreground text-sm">
                  Supports PDF, PNG, and JPG files up to 10MB each
                </p>
              </div>
            )}
            <Button variant="outline" size="sm" className="mt-4">
              Browse Files
            </Button>
          </div>
        </div>

        {/* Document Type Guide */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium text-sm mb-2">W-2 Forms</h4>
            <p className="text-xs text-muted-foreground">
              Wage and tax statements from your employer(s)
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium text-sm mb-2">1099-INT</h4>
            <p className="text-xs text-muted-foreground">
              Interest income from banks, investments
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium text-sm mb-2">1099-NEC</h4>
            <p className="text-xs text-muted-foreground">
              Non-employee compensation for contract work
            </p>
          </div>
        </div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Uploaded Documents</h4>
            {uploadedFiles.map((uploadFile) => {
              const typeInfo = getDocumentTypeInfo(uploadFile.type);
              return (
                <div
                  key={uploadFile.id}
                  className="flex items-center gap-3 p-3 border rounded-lg"
                >
                  <File className="h-8 w-8 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium truncate">
                        {uploadFile.file.name}
                      </p>
                      <Badge variant="outline" className={typeInfo.color}>
                        {typeInfo.label}
                      </Badge>
                    </div>
                    {uploadFile.status === "uploading" && (
                      <Progress value={uploadFile.progress} className="h-2" />
                    )}
                    {uploadFile.status === "completed" && (
                      <div className="flex items-center gap-1 text-success">
                        <CheckCircle className="h-3 w-3" />
                        <span className="text-xs">Upload complete</span>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(uploadFile.id)}
                    className="flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaxDocumentUpload;
