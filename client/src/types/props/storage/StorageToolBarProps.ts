export interface StorageToolBarProps {
    onSearch: (query: string) => void;
    onSort: (sort:number) => void;
    onReset: () => void;
}