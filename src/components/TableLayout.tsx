import React, { use, useEffect, useState } from 'react'
import { useResTableStore } from '../store/useResTableStore';
import type { Reservation } from '../types/Reservation';
import { useReservationStore } from '../store/useReservationStore';

const TableLayout = () => {

    const { reservations, fetchReservations } = useReservationStore();
    const { resTables, fetchResTables } = useResTableStore();

    const [filteredByDate, setFilteredByDate] = useState<string>(new Date().toISOString().slice(0, 10));    

    const filteredReservations = reservations.filter(reservation =>
        reservation.date.slice(0, 10) === filteredByDate
    );

    useEffect(() => {
        fetchResTables();
    }, [fetchResTables]);

    useEffect(() => {
        fetchReservations();
    }, [fetchReservations]);

    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-3 sm:grid-cols-8 md:grid-cols-12 gap-4">
                {
                    resTables.map(table => {
                        // Filter reservations for this table
                        const tableReservations = filteredReservations.filter((res: Reservation) => res.resTableId === table.id);

                        // Sum m1 and v1 for Alcohol menu
                        const alcoholSum = tableReservations.reduce((sum, res) => sum + (res.m1 || 0) + (res.v1 || 0), 0);

                        // Sum m2, m3, v2 for Non-Alcohol menu
                        const nonAlcoholSum = tableReservations.reduce((sum, res) => sum + (res.m2 || 0) + (res.m3 || 0) + (res.v2 || 0), 0);

                        return (
                            <div className='flex flex-col bg-[#555879] items-center justify-center h-[100px] w-[100px]' key={table.id}>
                                <div className="bg-gray-400 border-b border-solid items-center w-full">
                                    <p className="text-black bg-[#F4EBD3] items-center justify-center flex">{table.name}</p>
                                </div>
                                <div className="text-center text-sm text-gray-900 mt-2">
                                <p className={tableReservations.reduce((sum, res) => sum + (res.totalPerson || 0), 0) > 0 ? "text-[#da9ee0] font-bold" : "text-[#F4EBD3]"}>
                                    {tableReservations.reduce((sum, res) => sum + (res.totalPerson || 0), 0)}
                                </p>
                                </div>
                                <div className='text-center text-sm text-gray-900 mt-2 bg-[#F4EBD3] w-full p-1'>
                                    <span className="text-[#555879]">{nonAlcoholSum}NA</span>
                                    <span className="text-[#5EABD6]"> | </span>
                                    <span className="text-[#555879]">{alcoholSum}A</span>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default TableLayout