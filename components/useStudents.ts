import { useState, useEffect } from 'react';

interface Student {
  id: number;
  name: string;
  email: string;
}

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudents = async () => {
      const cached = localStorage.getItem('students');
      if (cached) {
        setStudents(JSON.parse(cached));
        setLoading(false);
      }

      try {
        const response = await fetch('/data/students.json');
        if (response.ok) {
          const data = await response.json();
          setStudents(data);
          localStorage.setItem('students', JSON.stringify(data));
        }
      } catch (error) {
        console.error('Failed to fetch students:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, []);

  return { students, loading };
}