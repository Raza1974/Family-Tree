"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Plus } from 'lucide-react';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";

interface FamilyMember {
  id: string;
  name: string;
  role: string;
  yearRange: string;
  imageUrl: string;
}

interface FamilyTree {
  [key: string]: FamilyMember[];
}

const initialFamilyMembers = {
  generation1: [
    {
      id: 'grandfather',
      name: 'Akhter Hussain',
      role: 'Grandfather',
      yearRange: '1984 - Death',
      imageUrl: '/placeholder.svg?height=120&width=120'
    },
    {
      id: 'grandmother',
      name: 'Shakira Bibi',
      role: 'Grandmother',
      yearRange: '1960 - Death',
      imageUrl: '/placeholder.svg?height=120&width=120'
    }
  ],
  generation2: [
    {
      id: 'father',
      name: 'S.Qasim Raza',
      role: 'Father',
      yearRange: '2020 1st July - Death',
      imageUrl: '/placeholder.svg?height=120&width=120'
    },
    {
      id: 'mother',
      name: 'Sakina Raza',
      role: 'Mother',
      yearRange: '2024 6th June - Present',
      imageUrl: '/placeholder.svg?height=120&width=120'
    }
  ],
  generation3: [
    {
      id: 'child1',
      name: 'Syed Mohammad Raza Rizvi',
      role: 'Son',
      yearRange: '1974 - Present',
      imageUrl: '/placeholder.svg?height=120&width=120'
    },
    {
      id: 'child2',
      name: 'Sobia Fatima',
      role: 'Wife of Syed Mohammad Raza Rizvi',
      yearRange: '1983 - Present',
      imageUrl: '/placeholder.svg?height=120&width=120'
    }
  ]
};

const FamilyTree: React.FC = () => {
  const [familyMembers, setFamilyMembers] = useState<FamilyTree>(initialFamilyMembers);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    role: '',
    yearRange: '',
    generation: 'generation1'
  });

  const handleMemberClick = (member: FamilyMember) => {
    setSelectedMember(member);
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedMembers = { ...familyMembers };

    if (!updatedMembers[newMember.generation]) {
      updatedMembers[newMember.generation] = [];
    }

    updatedMembers[newMember.generation].push({
      id: Date.now().toString(),
      name: newMember.name,
      role: newMember.role,
      yearRange: newMember.yearRange,
      imageUrl: '/placeholder.svg?height=120&width=120'
    });

    setFamilyMembers(updatedMembers);
    setIsAddingMember(false);
    setNewMember({
      name: '',
      role: '',
      yearRange: '',
      generation: 'generation1'
    });
  };

  const handleDownloadData = () => {
    const dataStr = JSON.stringify(familyMembers, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'family-tree.json';
    link.click();

    URL.revokeObjectURL(url);
  };

  const saveToGoogleAccount = () => {
    // TODO: Implement Google Drive API integration here
    alert("Save to Google Account functionality requires Google API integration.");
  };

  const renderGeneration = (generation: string, members: FamilyMember[]) => (
    <div className="flex flex-wrap justify-center gap-6 mb-8">
      {members.map((member) => {
        const isMale = member.role.toLowerCase().includes('father') || member.role.toLowerCase().includes('son');
        const cardColor = isMale ? 'bg-blue-500' : 'bg-pink-500';

        return (
          <div
            key={member.id}
            className={`${cardColor} rounded-lg shadow-lg p-4 w-48 cursor-pointer transform transition-transform hover:scale-105 hover:shadow-xl`}
            onClick={() => handleMemberClick(member)}
          >
            <Image
              src={member.imageUrl}
              alt={member.name}
              width={120}
              height={120}
              className="w-24 h-24 mx-auto mb-4 border-4 border-white rounded-full shadow-lg"
            />
            <h3 className="text-lg font-semibold text-center text-white">{member.name}</h3>
            <p className="text-center text-gray-200">{member.role}</p>
            <p className="text-sm text-center text-gray-300">{member.yearRange}</p>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-blue-600">Family Tree</h1>
          <div className="space-x-4">
            <Button onClick={() => setIsAddingMember(true)} className="text-white bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
            <Button onClick={handleDownloadData} className="text-white bg-green-600 hover:bg-green-700">
              Download Data
            </Button>
            <Button onClick={saveToGoogleAccount} className="text-white bg-yellow-600 hover:bg-yellow-700">
              Save to Google Account
            </Button>
          </div>
        </div>

        <div className="space-y-12">
          {Object.entries(familyMembers).map(([generation, members]) => (
            <div key={generation}>
              <h2 className="mb-4 text-xl font-semibold text-center text-purple-600">
                {generation.replace(/generation/, 'Generation ')}
              </h2>
              {renderGeneration(generation, members)}
              <div className="relative h-8">
                <div className="absolute w-px h-full bg-gray-300 left-1/2"></div>
              </div>
            </div>
          ))}
        </div>

        <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-blue-600">Member Details</DialogTitle>
            </DialogHeader>
            {selectedMember && (
              <div className="p-4">
                <h2 className="mb-2 text-xl font-bold text-center">{selectedMember.name}</h2>
                <p className="mb-2 text-center text-gray-600">{selectedMember.role}</p>
                <p className="mb-2 text-center text-gray-600">{selectedMember.yearRange}</p>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={isAddingMember} onOpenChange={setIsAddingMember}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-blue-600">Add Family Member</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="yearRange">Year Range</Label>
                <Input
                  id="yearRange"
                  value={newMember.yearRange}
                  onChange={(e) => setNewMember({ ...newMember, yearRange: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="generation">Generation</Label>
                <Select
                  value={newMember.generation}
                  onValueChange={(value) => setNewMember({ ...newMember, generation: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a generation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="generation1">Generation 1</SelectItem>
                    <SelectItem value="generation2">Generation 2</SelectItem>
                    <SelectItem value="generation3">Generation 3</SelectItem>
                    <SelectItem value="generation4">Generation 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-4">
                <Button onClick={() => setIsAddingMember(false)} type="button" variant="secondary">
                  Cancel
                </Button>
                <Button type="submit">Add Member</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default FamilyTree;

