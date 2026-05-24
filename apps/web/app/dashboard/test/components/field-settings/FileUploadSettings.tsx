import { BaseSettings } from "./BaseSettings";
import { FileUploadProps } from "../../types";

interface FileUploadSettingsProps {
    props: FileUploadProps;
    onChange: (newProps: Partial<FileUploadProps>) => void;
}

export function FileUploadSettings({ props, onChange }: FileUploadSettingsProps) {
    return <BaseSettings props={props} onChange={onChange} />;
}
