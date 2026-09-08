/**
 * Adaptador de Persistencia (Mapeo a Storage)
 */
export class DbAdapter {
    constructor() {
        this.STORAGE_KEY = 'pyme_appointments_db';
    }

    getAll() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    saveAll(records) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(records));
    }

    insert(record) {
        const records = this.getAll();
        records.push(record);
        this.saveAll(records);
        return record;
    }

    update(id, updatedFields) {
        const records = this.getAll();
        const index = records.findIndex(item => item.id === id);
        
        if (index === -1) return null;

        records[index] = { ...records[index], ...updatedFields };
        this.saveAll(records);
        return records[index];
    }
}