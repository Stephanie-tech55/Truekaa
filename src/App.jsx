import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select, SelectTrigger, SelectValue,
  SelectContent, SelectItem
} from "@/components/ui/select";

export default function TruekaApp() {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({ name: '', user: '', type: 'ofrece' });
  const [filterType, setFilterType] = useState('todos');

  useEffect(() => {
    const storedSkills = localStorage.getItem('skills');
    if (storedSkills) setSkills(JSON.parse(storedSkills));
  }, []);

  useEffect(() => {
    localStorage.setItem('skills', JSON.stringify(skills));
  }, [skills]);

  const handleAddSkill = () => {
    if (newSkill.name && newSkill.user) {
      setSkills([...skills, newSkill]);
      setNewSkill({ name: '', user: '', type: 'ofrece' });
    }
  };

  const filteredSkills = skills.filter(skill =>
    filterType === 'todos' ? true : skill.type === filterType
  );

  const getMatches = () => {
    const offers = skills.filter(s => s.type === 'ofrece');
    const requests = skills.filter(s => s.type === 'busca');

    return requests.flatMap(req =>
      offers
        .filter(off => off.name.toLowerCase() === req.name.toLowerCase())
        .map(off => ({
          habilidad: req.name,
          busca: req.user,
          ofrece: off.user
        }))
    );
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-gradient-to-br from-blue-50 to-purple-100 rounded-2xl shadow-xl">
      <h1 className="text-5xl font-extrabold text-center mb-4 text-purple-700 drop-shadow-sm">Trueka</h1>
      <p className="text-center text-xl mb-10 text-gray-700">Intercambia habilidades con tu comunidad</p>

      <div className="my-6 text-center">
        <p className="text-sm text-gray-500 mb-2">Publicidad</p>
        <div className="bg-yellow-100 border-yellow-400 border p-4 rounded-lg">
          <p className="text-gray-800">[Espacio para anuncio de Google AdSense o patrocinador local]</p>
        </div>
      </div>

      <div className="mb-10 space-y-4 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold text-blue-700">Agregar nueva habilidad</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label className="text-gray-600">Habilidad</Label>
            <Input
              className="mt-1"
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              placeholder="Ej. Clases de costura"
            />
          </div>
          <div>
            <Label className="text-gray-600">Tu nombre</Label>
            <Input
              className="mt-1"
              value={newSkill.user}
              onChange={(e) => setNewSkill({ ...newSkill, user: e.target.value })}
              placeholder="Ej. María"
            />
          </div>
          <div>
            <Label className="text-gray-600">Tipo</Label>
            <Select
              value={newSkill.type}
              onValueChange={(value) => setNewSkill({ ...newSkill, type: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ofrece">Ofrece</SelectItem>
                <SelectItem value="busca">Busca</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold" onClick={handleAddSkill}>
          Agregar habilidad
        </Button>
      </div>

      <div className="mb-6 bg-white p-4 rounded-xl shadow-sm">
        <Label className="text-gray-600">Filtrar por tipo:</Label>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="mt-1 w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="ofrece">Solo los que ofrecen</SelectItem>
            <SelectItem value="busca">Solo los que buscan</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {filteredSkills.map((skill, i) => (
          <Card key={i} className="bg-white border-l-4 border-purple-400">
            <CardContent className="p-4">
              <h2 className="text-xl font-bold text-purple-800">{skill.name}</h2>
              <p className="text-gray-600">Usuario: <span className="font-medium">{skill.user}</span></p>
              <p className="text-sm italic text-gray-500">
                {skill.type === "ofrece" ? "Ofrece" : "Busca"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mb-6 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold text-green-700 mb-2">Coincidencias encontradas</h2>
        {getMatches().length === 0 ? (
          <p className="text-gray-500">Aún no hay coincidencias.</p>
        ) : (
          getMatches().map((match, i) => (
            <Card key={i} className="mb-2 bg-green-50 border-l-4 border-green-500">
              <CardContent className="p-4">
                <p className="text-green-800">
                  <strong>{match.busca}</strong> busca <strong>{match.habilidad}</strong>, y <strong>{match.ofrece}</strong> la ofrece.
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}