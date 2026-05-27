export function downloadCSV(filename: string, data: Record<string, any>[]) {
    if (!data || data.length === 0) return;

    // Extract headers from the first object
    const headers = Object.keys(data[0] || {});
    
    // Create CSV content
    const csvContent = [
        // Header row
        headers.map(header => `"${String(header).replace(/"/g, '""')}"`).join(','),
        // Data rows
        ...data.map(row => 
            headers.map(fieldName => {
                let cellData = row[fieldName] === null || row[fieldName] === undefined ? '' : String(row[fieldName]);
                // Escape double quotes
                cellData = cellData.replace(/"/g, '""');
                // Wrap all fields in double quotes to safely handle commas and newlines
                return `"${cellData}"`;
            }).join(',')
        )
    ].join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
