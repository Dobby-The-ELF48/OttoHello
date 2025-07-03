/*  src/hooks/useVisitorStorage.ts  */
import { useState } from 'react';

/* keep only the fields we really store locally */
export interface LocalVisitor {
  id: string;
  fullName: string;

  /* optional extras (safe to be undefined) */
  personToMeet?: string;
  reasonForVisit?: string;
  otherReason?: string;
  phoneNumber?: string;
  photo?: string;

  checkInTime: string;          // ISO
  checkOutTime: string | null;
}


export function useVisitorStorage() {
  const [visitors, setVisitors] = useState<LocalVisitor[]>(() => {
    const raw = localStorage.getItem('ottohello_visitors');
    return raw ? (JSON.parse(raw) as LocalVisitor[]) : [];
  });

  /* ---------- ADD ---------- */
  const addVisitor = ({
    id,
    fullName,
  }: {
    id: string;
    fullName: string;
  }) => {
    const newVisitor: LocalVisitor = {
      id,
      fullName,
      checkInTime: new Date().toISOString(),
      checkOutTime: null,
    };
    const updated = [...visitors, newVisitor];
    setVisitors(updated);
    localStorage.setItem('ottohello_visitors', JSON.stringify(updated));
  };

  /* ---------- CHECK-OUT ---------- */
  const checkOutVisitor = (id: string) => {
    const updated = visitors.map((v) =>
      v.id === id ? { ...v, checkOutTime: new Date().toISOString() } : v
    );
    setVisitors(updated);
    localStorage.setItem('ottohello_visitors', JSON.stringify(updated));
    return updated.find((v) => v.id === id) ?? null;
  };

  return { visitors, addVisitor, checkOutVisitor };
}
