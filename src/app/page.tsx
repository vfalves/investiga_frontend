"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { Investigacao } from "@/types";
import { AlertCircle, CheckCircle, PlusCircle, FileText } from "lucide-react";

export default function Home() {
    const [lista, setLista] = useState<Investigacao[]>([]);
    const [novo, setNovo] = useState({ titulo: "", localizacao: "", descricao: "" });
    const [msg, setMsg] = useState("");

    // Carregar lista ao iniciar
    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = () => {
        api.get('/investigacoes')
           .then(res => setLista(res.data))
           .catch(err => console.error("Erro de conexão (Java desligado?):", err));
    }

    // Função para salvar
    const salvar = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/investigacoes', novo);
            setMsg("Incidente registrado com sucesso!");
            setNovo({ titulo: "", localizacao: "", descricao: "" });
            carregarDados(); 
            // Limpa mensagem após 3 segundos
            setTimeout(() => setMsg(""), 3000);
        } catch (error) {
            setMsg("Erro ao salvar. Verifique se o Backend Java está rodando.");
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 p-8 font-sans text-slate-800">
            <div className="max-w-5xl mx-auto">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Portal de Segurança</h1>
                        <p className="text-slate-500">Gestão de Investigações e Incidentes</p>
                    </div>
                </header>
                
                <div className="grid md:grid-cols-3 gap-6">
                    {/* COLUNA DA ESQUERDA: FORMULÁRIO */}
                    <div className="md:col-span-1">
                        <form onSubmit={salvar} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 sticky top-6">
                            <h2 className="font-semibold mb-4 flex items-center gap-2 text-lg">
                                <PlusCircle size={20} className="text-blue-600"/> 
                                Novo Registro
                            </h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Título do Evento</label>
                                    <input 
                                        required
                                        className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Ex: Queda de material"
                                        value={novo.titulo}
                                        onChange={e => setNovo({...novo, titulo: e.target.value})}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Localização</label>
                                    <input 
                                        required
                                        className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Ex: Setor de Cargas"
                                        value={novo.localizacao}
                                        onChange={e => setNovo({...novo, localizacao: e.target.value})}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
                                    <textarea 
                                        required
                                        className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
                                        placeholder="Descreva o ocorrido..."
                                        value={novo.descricao}
                                        onChange={e => setNovo({...novo, descricao: e.target.value})}
                                    />
                                </div>

                                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors flex justify-center items-center gap-2">
                                    Registrar Incidente
                                </button>
                            </div>

                            {msg && (
                                <div className={`mt-4 p-3 rounded text-sm flex items-center gap-2 ${msg.includes("Erro") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
                                    {msg.includes("Erro") ? <AlertCircle size={16}/> : <CheckCircle size={16}/>}
                                    {msg}
                                </div>
                            )}
                        </form>
                    </div>

                    {/* COLUNA DA DIREITA: LISTA */}
                    <div className="md:col-span-2 space-y-4">
                        <h2 className="font-semibold text-lg text-slate-700 mb-2">Histórico Recente</h2>
                        
                        {lista.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                                <p className="text-slate-400">Nenhum incidente registrado ainda.</p>
                                <p className="text-xs text-slate-400 mt-1">(Certifique-se que o Java está rodando)</p>
                            </div>
                        ) : (
                            lista.map((item) => (
                                <div key={item.id} className="bg-white p-5 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex justify-between items-start group">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                                                {item.status || 'ABERTA'}
                                            </span>
                                            <span className="text-slate-400 text-xs">#{item.id}</span>
                                        </div>
                                        <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition-colors">
                                            {item.titulo}
                                        </h3>
                                        <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
                                            📍 {item.localizacao} 
                                        </p>
                                    </div>
                                    <button className="text-slate-400 hover:text-blue-600 p-2">
                                        <FileText size={20}/>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}