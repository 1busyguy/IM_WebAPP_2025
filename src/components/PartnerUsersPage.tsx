import React, { useState } from 'react';
import { X, LayoutDashboard, Users, FileText, TextSelection as Collection, Zap, Scan, Eye, Heart, Pencil } from 'lucide-react';
import { Partner } from '../types';
import { generatePastelColor } from '../utils/colorUtils';
import { EditCollectionModal } from './EditCollectionModal';
import { EditActivationModal } from './EditActivationModal';

interface PartnerUsersPageProps {
  partner: Partner;
  onClose: () => void;
  onDashboardClick: () => void;
  onNavigate: (tab: 'dashboard' | 'users' | 'agreements') => void;
}

interface PartnerUser {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
  collections_count: number;
  activations_count: number;
  scans_count: number;
  views_count: number;
  likes_count: number;
  is_active: boolean;
}

interface TopCollection {
  id: string;
  title: string;
  user: string;
  scans: number;
  views: number;
  likes: number;
  activations: number;
}

interface TopActivation {
  id: string;
  title: string;
  user: string;
  scans: number;
  views: number;
  likes: number;
}

// Mock data for partner users
const mockUsers: PartnerUser[] = Array.from({ length: 20 }, (_, i) => ({
  id: `u${i + 1}`,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  avatar_url: `https://source.unsplash.com/100x100/?portrait&sig=${i}`,
  collections_count: Math.floor(Math.random() * 25) + 5,
  activations_count: Math.floor(Math.random() * 30) + 10,
  scans_count: Math.floor(Math.random() * 40) + 15,
  views_count: Math.floor(Math.random() * 50) + 20,
  likes_count: Math.floor(Math.random() * 60) + 25,
  is_active: Math.random() > 0.2,
}));

// Mock data for top collections
const mockTopCollections: TopCollection[] = [
  {
    id: 'c1',
    title: 'Summer Collection 2024',
    user: 'Sarah Chen',
    scans: 1234,
    views: 5678,
    likes: 890,
    activations: 12,
  },
  {
    id: 'c2',
    title: 'Spring Fashion Line',
    user: 'Michael Johnson',
    scans: 987,
    views: 4321,
    likes: 567,
    activations: 8,
  },
];

// Mock data for top activations
const mockTopActivations: TopActivation[] = [
  {
    id: 'a1',
    title: 'Holiday Campaign',
    user: 'Emma Thompson',
    scans: 2345,
    views: 6789,
    likes: 901,
  },
  {
    id: 'a2',
    title: 'New Product Launch',
    user: 'David Wilson',
    scans: 1789,
    views: 5432,
    likes: 678,
  },
];

export const PartnerUsersPage: React.FC<PartnerUsersPageProps> = ({
  partner,
  onClose,
  onDashboardClick,
  onNavigate,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCollection, setSelectedCollection] = useState<TopCollection | null>(null);
  const [selectedActivation, setSelectedActivation] = useState<TopActivation | null>(null);
  const [isEditCollectionModalOpen, setIsEditCollectionModalOpen] = useState(false);
  const [isEditActivationModalOpen, setIsEditActivationModalOpen] = useState(false);
  const usersPerPage = 8;

  const handleUserSummaryClick = () => {
    onNavigate('dashboard');
  };

  // Calculate pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = mockUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(mockUsers.length / usersPerPage);

  const handleEditCollection = (collection: TopCollection) => {
    setSelectedCollection(collection);
    setIsEditCollectionModalOpen(true);
  };

  const handleEditActivation = (activation: TopActivation) => {
    setSelectedActivation(activation);
    setIsEditActivationModalOpen(true);
  };

  const handleEditCollectionSubmit = (collectionData: any) => {
    console.log('Updating collection:', collectionData);
    setIsEditCollectionModalOpen(false);
    setSelectedCollection(null);
  };

  const handleEditActivationSubmit = (activationData: any) => {
    console.log('Updating activation:', activationData);
    setIsEditActivationModalOpen(false);
    setSelectedActivation(null);
  };

  const UserRow = ({ user }: { user: PartnerUser }) => (
    <div
      className={`p-4 rounded-lg transition-all duration-200 border border-gray-100 ${
        user.is_active 
          ? 'bg-white hover:shadow-md' 
          : 'bg-gray-50 opacity-75'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div
            className="w-10 h-10 rounded-full shadow-sm flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: generatePastelColor(user.id) }}
          >
            {user.name.charAt(0)}
          </div>
          <div>
            <h4 className="font-medium text-gray-900">{user.name}</h4>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Collection className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium">{user.collections_count}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Zap className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium">{user.activations_count}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Scan className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">{user.scans_count}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium">{user.views_count}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4 text-rose-600" />
              <span className="text-sm font-medium">{user.likes_count}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPaginationButton = (page: number) => (
    <button
      key={page}
      onClick={() => setCurrentPage(page)}
      className={`px-3 py-1 rounded-lg ${
        currentPage === page
          ? 'bg-blue-600 text-white'
          : 'border border-gray-300 hover:bg-gray-50'
      }`}
    >
      {page}
    </button>
  );

  const renderPagination = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(renderPaginationButton(i));
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(renderPaginationButton(i));
        }
        pages.push(<span key="ellipsis1" className="px-2">...</span>);
        pages.push(renderPaginationButton(totalPages));
      } else if (currentPage >= totalPages - 2) {
        pages.push(renderPaginationButton(1));
        pages.push(<span key="ellipsis2" className="px-2">...</span>);
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(renderPaginationButton(i));
        }
      } else {
        pages.push(renderPaginationButton(1));
        pages.push(<span key="ellipsis3" className="px-2">...</span>);
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(renderPaginationButton(i));
        }
        pages.push(<span key="ellipsis4" className="px-2">...</span>);
        pages.push(renderPaginationButton(totalPages));
      }
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <h1 
              className="text-3xl font-bold cursor-pointer hover:text-blue-600 transition-colors"
              onClick={onDashboardClick}
            >
              Admin Dashboard
            </h1>
            <span className="text-gray-500">&gt;</span>
            <h2 
              className="text-3xl font-bold cursor-pointer hover:text-blue-600 transition-colors"
              onClick={handleUserSummaryClick}
            >
              Partner Account
            </h2>
            <span className="text-gray-500">&gt;</span>
            <h2 className="text-3xl font-bold text-blue-600">Users</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Navigation Bar */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-8 py-3">
              <button
                onClick={handleUserSummaryClick}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all text-gray-600 hover:bg-blue-50 hover:text-blue-600"
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Partner Summary</span>
              </button>
              <button
                className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all bg-blue-600 text-white shadow-md transform scale-105"
              >
                <Users className="w-5 h-5" />
                <span>Users</span>
              </button>
              <button
                onClick={() => onNavigate('agreements')}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all text-gray-600 hover:bg-blue-50 hover:text-blue-600"
              >
                <FileText className="w-5 h-5" />
                <span>Agreements</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column - User List */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-4">Partner Users</h3>
              <div className="space-y-3">
                {currentUsers.map((user) => (
                  <UserRow key={user.id} user={user} />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center items-center space-x-2 mt-6">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                {renderPagination()}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Top Content */}
          <div className="space-y-6">
            {/* Top Collections */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Top Collections</h3>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View All
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {mockTopCollections.slice(0, 2).map((collection) => (
                  <div
                    key={collection.id}
                    className="p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow bg-gradient-to-br from-purple-50 to-white"
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex items-center space-x-2 mb-2">
                        <Collection className="w-5 h-5 text-purple-600" />
                        <h4 className="font-medium text-gray-900 line-clamp-1">{collection.title}</h4>
                      </div>
                      <div className="relative aspect-video mb-3 bg-purple-50 rounded-lg overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Collection className="w-12 h-12 text-purple-200" />
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">by {collection.user}</p>
                      <div className="flex flex-col space-y-3 mt-auto pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-1">
                              <Scan className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-medium">{collection.scans}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Eye className="w-4 h-4 text-emerald-600" />
                              <span className="text-sm font-medium">{collection.views}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Heart className="w-4 h-4 text-rose-600" />
                              <span className="text-sm font-medium">{collection.likes}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Zap className="w-4 h-4 text-amber-600" />
                              <span className="text-sm font-medium">{collection.activations}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleEditCollection(collection)}
                            className="p-1 hover:bg-purple-100 rounded-full transition-colors"
                          >
                            <Pencil className="w-4 h-4 text-purple-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Activations */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Top Activations</h3>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View All
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {mockTopActivations.slice(0, 2).map((activation) => (
                  <div
                    key={activation.id}
                    className="p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow bg-gradient-to-br from-amber-50 to-white"
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex items-center space-x-2 mb-2">
                        <Zap className="w-5 h-5 text-amber-600" />
                        <h4 className="font-medium text-gray-900 line-clamp-1">{activation.title}</h4>
                      </div>
                      <div className="relative aspect-video mb-3 bg-amber-50 rounded-lg overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Zap className="w-12 h-12 text-amber-200" />
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">by {activation.user}</p>
                      <div className="flex flex-col space-y-3 mt-auto pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-1">
                              <Scan className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-medium">{activation.scans}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Eye className="w-4 h-4 text-emerald-600" />
                              <span className="text-sm font-medium">{activation.views}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Heart className="w-4 h-4 text-rose-600" />
                              <span className="text-sm font-medium">{activation.likes}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleEditActivation(activation)}
                            className="p-1 hover:bg-amber-100 rounded-full transition-colors"
                          >
                            <Pencil className="w-4 h-4 text-amber-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Collection Modal */}
      {selectedCollection && (
        <EditCollectionModal
          isOpen={isEditCollectionModalOpen}
          onClose={() => {
            setIsEditCollectionModalOpen(false);
            setSelectedCollection(null);
          }}
          onSubmit={handleEditCollectionSubmit}
          collection={{
            id: selectedCollection.id,
            title: selectedCollection.title,
            description: '',
            category: '',
            activations: [],
            externalLinks: [],
            cover_image: null,
            status: 'published'
          }}
        />
      )}

      {/* Edit Activation Modal */}
      {selectedActivation && (
        <EditActivationModal
          isOpen={isEditActivationModalOpen}
          onClose={() => {
            setIsEditActivationModalOpen(false);
            setSelectedActivation(null);
          }}
          onSubmit={handleEditActivationSubmit}
          activation={{
            id: selectedActivation.id,
            title: selectedActivation.title,
            description: '',
            image: null,
            video: null,
            externalLinks: [],
            status: 'published'
          }}
        />
      )}
    </div>
  );
};