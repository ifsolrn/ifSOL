"use client";

import { client } from "@/lib/sanity.client";
import groq from "groq";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FilterDropdown } from "@/components/FilterDropdown";
import { Pagination } from "@/components/Pagination";
import { ArtigoMobileFilters } from "./ArtigoMobileFilters";

const BASE_PATH = "/artigos"

const ITEMS_PER_PAGE = 6;

interface Artigo {
    _id: string;
    title: string;
    description: string;
    slug: string;
    publicationDate: string;
    campus: { name: string } | null;
}
interface FilterOption {
    _id: string;
    name: string;
}

interface ArtigosClientProps{
    initialArtigos: Artigo[];
    initialTotalItems: number;
    initialYears: FilterOption[];
    initialCampi: FilterOption[];
}

export function ArtigosClient ({
    initialArtigos,
    initialTotalItems,
    initialYears,
    initialCampi
}: ArtigosClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [artigos, setArtigos] = useState<Artigo[]>(initialArtigos);
    const [totalItems, setTotalItems] = useState<number>(initialTotalItems);
    const [availableYears, setAvailableYears] = useState<FilterOption[]>(initialYears);
    const [campi, setCampi] = useState<FilterOption[]>(initialCampi);

    const anosFromUrl = searchParams.get('anos')?.split(',').filter(Boolean) || [];
    const campiFromUrl = searchParams.get('campi')?.split(',').filter(Boolean) || [];

    const [selectedYears, setSelectedYears] = useState<string[]>(anosFromUrl);
    const [selectedCampi, setSelectedCampi] = useState<string[]>(campiFromUrl);

    const currentPage = Number(searchParams.get('page')) || 1;

    useEffect(() => {
        async function fetchData(){
            const currentYears = searchParams.get('anos')?.split(',').filter(Boolean) || [];
            const currentCampi = searchParams.get('campi')?.split(',').filter(Boolean) || [];
            const currentPage = Number(searchParams.get('page')) || 1;

            const anoCondition = currentYears.length > 0 ? 
                `publicationDate in [${currentYears.map(a => `'${a}'`).join(',')}]` : 
                '';

            const campiCondition = currentCampi.length > 0 ? 
                `campus._ref in [${currentCampi.map(id => `'${id}'`).join(',')}]` : 
                '';

            const filterConditions = [anoCondition, campiCondition]
                .filter(Boolean)
                .join(' && ');

            const countQuery = groq`
                count(*[_type == "artigoAcademico" ${filterConditions ? `&& ${filterConditions}` : ''}])
            `;

            const artigosQuery = groq`
                *[_type == "artigoAcademico" ${filterConditions ? `&& ${filterConditions}` : ''}] 
                | order(_createdAt desc) [${(currentPage - 1) * ITEMS_PER_PAGE}...${currentPage * ITEMS_PER_PAGE}] {
                    _id, title, "description": pt::text(description), "slug": slug.current, publicationDate, campus->{name}
                }
            `;

            const [fetchedArtigos, fetchedTotalItems] = await Promise.all([
                client.fetch(artigosQuery),
                client.fetch(countQuery),
            ]);

            setArtigos(fetchedArtigos);
            setTotalItems(fetchedTotalItems);
        }

        const urlParamsString = searchParams.toString();
        if (urlParamsString) {
            fetchData();
        }
    }, [searchParams]);
    const handleYearChange = (year: string) => { 
        setSelectedYears(prev =>
            prev.includes(year)
                ? prev.filter(a => a !== year)
                : [...prev, year]
        );
    };

    const handleCampusChange = (campusId: string) => {
        setSelectedCampi(prev =>
            prev.includes(campusId)
                ? prev.filter(id => id !== campusId)
                : [...prev, campusId]
        );
    };

    const handleSearch = () => { 
        const params = new URLSearchParams();
        if (selectedYears.length > 0) {
            params.set('anos', selectedYears.join(','));
        }
        if (selectedCampi.length > 0) {
            params.set('campi', selectedCampi.join(','));
        }
        params.set('page', '1');
        router.push(`${BASE_PATH}?${params.toString()}`);
    };

    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    return (
        <> 
            <div className="container mx-auto px-8 py-12 flex-grow">
                <h1 className="text-4xl md:text-5xl font-bold mb-8 text-green-800 text-center">
                    Artigos Acadêmicos
                </h1>
                
                
                <div className="md:hidden w-full flex justify-center mb-6">
                    <ArtigoMobileFilters 
                        availableYears={availableYears} 
                        campi={campi} 
                        selectedYears={selectedYears}
                        selectedCampi={selectedCampi}
                        onYearChange={handleYearChange}
                        onCampusChange={handleCampusChange}
                        onSearch={handleSearch}
                    />
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    
                    <div className="ww-full min-w-0 md:w-3/4 flex flex-col gap-6">
                        {artigos.length > 0 ? (
                            artigos.map((artigo) => (
                                <div key={artigo._id} className="w-full min-w-0 overflow-hidden bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col items-start gap-4">
                                    <h2 className="w-full text-2xl font-bold text-green-800 [overflow-wrap:anywhere]">{artigo.title}</h2>
                                    <p className="w-full min-w-0 overflow-hidden text-gray-700 line-clamp-2 [overflow-wrap:anywhere]">{artigo.description}</p>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                        <span>Ano: {artigo.publicationDate || 'Não especificado'}</span>
                                        <span>Campus: {artigo.campus?.name || 'Não especificado'}</span>
                                    </div>
                                    
                                    <Link href={`${BASE_PATH}/${artigo.slug}`} passHref>
                                        <button className="mt-auto px-6 py-2 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition-colors cursor-pointer">
                                            Ler artigo
                                        </button>
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-600">Nenhum artigo encontrado com os filtros selecionados.</p>
                        )}
                    </div>
                    
                    
                    <aside className="hidden md:block w-full md:w-1/4">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-28 flex flex-col gap-4">
                            <h3 className="text-xl font-bold mb-4 text-green-800">Filtros</h3>
                            
                            
                            <FilterDropdown title="Ano de Publicação" options={availableYears}>
                                {availableYears.map((year: FilterOption) => (
                                    <label key={year._id} className="flex items-center gap-2 text-gray-700">
                                        <input 
                                            type="checkbox" 
                                            className="form-checkbox text-green-500 rounded" 
                                            checked={selectedYears.includes(year._id)}
                                            onChange={() => handleYearChange(year._id)}
                                        />
                                        {year.name}
                                    </label>
                                ))}
                            </FilterDropdown>
                            
                            
                            <FilterDropdown title="Campus" options={campi}>
                                {campi.map((campus: FilterOption) => (
                                    <label key={campus._id} className="flex items-center gap-2 text-gray-700">
                                        <input 
                                            type="checkbox" 
                                            className="form-checkbox text-green-500 rounded" 
                                            checked={selectedCampi.includes(campus._id)}
                                            onChange={() => handleCampusChange(campus._id)}
                                        />
                                        {campus.name}
                                    </label>
                                ))}
                            </FilterDropdown>

                            <button 
                                onClick={handleSearch}
                                className="w-full mt-4 px-6 py-2 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition-colors cursor-pointer"
                            >
                                Buscar Artigos
                            </button>
                        </div>
                    </aside>
                </div>
                
                
                {totalItems > 0 && (
                    <div className="flex justify-center items-center mt-8">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            basePath={BASE_PATH}
                        />
                    </div>
                )}
            </div>
        </>
    );
}


    
