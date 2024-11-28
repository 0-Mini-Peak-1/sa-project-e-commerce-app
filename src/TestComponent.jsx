import React, { useEffect } from 'react';
import { supabase } from './supabaseClient'; // Ensure the path to your Supabase client file is correct

const TestComponent = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase.from('Product').select('*'); // Replace 'products' with your actual table name
        if (error) {
          console.error('Error fetching data:', error);
        } else {
          console.log('Fetched data:', data);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      }
    };

    fetchData();
  }, []);

  return <div>Check the console for Supabase data.</div>;
};

export default TestComponent;
