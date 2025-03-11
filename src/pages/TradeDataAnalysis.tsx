import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';

interface TradeStat {
  id: string;
  hs_code_id: string;
  country_name: string;
  year_val: number;
  month_val: number;
  value: number;
  volume: number;
  trade_flow: string;
  created_at: string;
  description: string;
}

const schema = z.object({
  hsCode: z.string().optional(),
  country: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

type Schema = z.infer<typeof schema>;

export default function TradeDataAnalysis() {
  const [data, setData] = useState<TradeStat[]>([]);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  });

  const { hsCode, country, startDate, endDate } = watch();

  useEffect(() => {
    const fetchData = async () => {
      let query = supabase
        .from('trade_stats')
        .select('*');

      if (hsCode) {
        query = query.eq('hs_code_id', hsCode);
      }
      if (country) {
        query = query.eq('country_name', country);
      }
      if (startDate) {
        query = query.gte('year_val', startDate.getFullYear());
      }
      if (endDate) {
        query = query.lte('year_val', endDate.getFullYear());
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching data:', error);
      } else {
        setData(data as TradeStat[] || []);
      }
    };

    fetchData();
  }, [hsCode, country, startDate, endDate]);

  const onSubmit = (data: Schema) => {
    console.log(data);
    // The data is fetched in useEffect, so no need to do anything here
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-gray-900">Trade Data Analysis</h1>
      <p className="mt-4 text-gray-600">
        Analyze trade data with advanced filtering and visualization options.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="hsCode" className="block text-sm font-medium text-gray-700">
              HS Code
            </label>
            <input
              type="text"
              id="hsCode"
              {...register('hsCode')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            {errors.hsCode && (
              <p className="text-red-500 text-xs mt-1">{errors.hsCode.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">
              Country
            </label>
            <input
              type="text"
              id="country"
              {...register('country')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            {errors.country && (
              <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              {...register('startDate')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            {errors.startDate && (
              <p className="text-red-500 text-xs mt-1">{errors.startDate.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              {...register('endDate')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            {errors.endDate && (
              <p className="text-red-500 text-xs mt-1">{errors.endDate.message}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Apply Filters
        </button>
      </form>

      <ComposedChart
        width={500}
        height={400}
        data={data}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis dataKey="year_val" />
        <YAxis dataKey="value" />
        <Tooltip />
        <Legend />
        <Area type="monotone" dataKey="value" fill="#8884d8" stroke="#8884d8" />
        <Bar dataKey="volume" barSize={20} fill="#413ea0" />
        <Line type="monotone" dataKey="value" stroke="#ff7300" />
      </ComposedChart>

      <div className="mt-8">
        <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
          Export CSV
        </button>
        <button className="ml-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
          Export PDF
        </button>
        <button className="ml-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
          Schedule Report
        </button>
      </div>
    </div>
  );
}
