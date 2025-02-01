import React, { useState } from 'react';
import { X, LayoutDashboard, Users, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { Partner } from '../types';

interface PartnerAgreementsPageProps {
  partner: Partner;
  onClose: () => void;
  onDashboardClick: () => void;
  onNavigate: (tab: 'dashboard' | 'users' | 'agreements') => void;
}

interface Agreement {
  id: string;
  title: string;
  type: 'terms' | 'privacy' | 'data' | 'service';
  status: 'pending' | 'accepted';
  acceptedAt?: string;
  content: string;
}

const mockAgreements: Agreement[] = [
  {
    id: 'terms-of-service',
    title: 'Terms of Service',
    type: 'terms',
    status: 'pending',
    content: `Terms of Service Agreement

1. Introduction
Welcome to our platform. By accessing or using our services, you agree to be bound by these terms.

2. User Obligations
2.1. You must provide accurate information
2.2. You are responsible for maintaining account security
2.3. You agree to comply with all applicable laws

3. Service Description
3.1. We provide digital content management services
3.2. Services are provided "as is"
3.3. We reserve the right to modify services

4. Intellectual Property
4.1. You retain rights to your content
4.2. We retain rights to our platform
4.3. You grant us license to host your content

5. Privacy and Data
5.1. We collect and process data as described in our Privacy Policy
5.2. You agree to our data handling practices
5.3. We implement reasonable security measures

6. Termination
6.1. Either party may terminate this agreement
6.2. We may suspend service for violations
6.3. Termination consequences

7. Liability
7.1. Limitation of liability
7.2. Indemnification
7.3. No warranty

8. General Provisions
8.1. Governing law
8.2. Dispute resolution
8.3. Severability
8.4. Entire agreement

9. Contact Information
For questions about these terms, please contact legal@example.com

Last updated: January 31, 2024`
  },
  {
    id: 'privacy-policy',
    title: 'Privacy Policy',
    type: 'privacy',
    status: 'pending',
    content: `Privacy Policy

1. Information We Collect
1.1. Personal Information
1.2. Usage Data
1.3. Cookies and Tracking

2. How We Use Your Information
2.1. Service Provision
2.2. Communication
2.3. Analytics

3. Information Sharing
3.1. Third-Party Service Providers
3.2. Legal Requirements
3.3. Business Transfers

4. Your Rights
4.1. Access
4.2. Correction
4.3. Deletion
4.4. Portability

5. Security Measures
5.1. Data Protection
5.2. Breach Notification
5.3. Employee Training

6. International Transfers
6.1. Data Centers
6.2. Safeguards
6.3. Compliance

7. Children's Privacy
7.1. Age Restrictions
7.2. Parental Consent
7.3. Data Collection

8. Changes to This Policy
8.1. Updates
8.2. Notification
8.3. Continued Use

9. Contact Us
For privacy-related inquiries, please contact privacy@example.com

Last updated: January 31, 2024`
  },
  {
    id: 'data-processing',
    title: 'Data Processing Agreement',
    type: 'data',
    status: 'pending',
    content: `Data Processing Agreement

1. Definitions
1.1. Personal Data
1.2. Processing
1.3. Controller
1.4. Processor

2. Scope and Purpose
2.1. Nature of Processing
2.2. Duration
2.3. Categories of Data

3. Obligations
3.1. Data Protection Laws
3.2. Confidentiality
3.3. Security Measures

4. Sub-processing
4.1. Authorization
4.2. Requirements
4.3. Liability

5. Data Subject Rights
5.1. Assistance
5.2. Response Time
5.3. Documentation

6. Security
6.1. Technical Measures
6.2. Organizational Measures
6.3. Access Controls

7. Audits
7.1. Right to Audit
7.2. Cooperation
7.3. Reports

8. Data Breaches
8.1. Notification
8.2. Investigation
8.3. Remediation

9. Termination
9.1. Data Return
9.2. Data Deletion
9.3. Certification

Last updated: January 31, 2024`
  },
  {
    id: 'service-agreement',
    title: 'Service Level Agreement',
    type: 'service',
    status: 'pending',
    content: `Service Level Agreement

1. Service Description
1.1. Platform Availability
1.2. Performance Metrics
1.3. Support Services

2. Service Levels
2.1. Uptime Guarantee
2.2. Response Times
2.3. Resolution Times

3. Monitoring
3.1. System Monitoring
3.2. Performance Tracking
3.3. Reporting

4. Support
4.1. Support Hours
4.2. Priority Levels
4.3. Escalation Process

5. Maintenance
5.1. Scheduled Maintenance
5.2. Emergency Maintenance
5.3. Notifications

6. Penalties
6.1. Service Credits
6.2. Calculation
6.3. Claims Process

7. Exclusions
7.1. Force Majeure
7.2. Customer Actions
7.3. Third-Party Services

8. Reporting
8.1. Monthly Reports
8.2. Incident Reports
8.3. Performance Analytics

9. Reviews
9.1. Periodic Reviews
9.2. Adjustments
9.3. Amendments

Last updated: January 31, 2024`
  }
];

export const PartnerAgreementsPage: React.FC<PartnerAgreementsPageProps> = ({
  partner,
  onClose,
  onDashboardClick,
  onNavigate,
}) => {
  const [selectedAgreement, setSelectedAgreement] = useState<Agreement>(mockAgreements[0]);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState<{[key: string]: boolean}>({});
  const [acceptedAgreements, setAcceptedAgreements] = useState<{[key: string]: boolean}>({});

  const handleUserSummaryClick = () => {
    onNavigate('dashboard');
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const isAtBottom = Math.abs(
      element.scrollHeight - element.clientHeight - element.scrollTop
    ) < 1;

    if (isAtBottom) {
      setHasScrolledToBottom(prev => ({
        ...prev,
        [selectedAgreement.id]: true
      }));
    }
  };

  const handleAcceptAgreement = () => {
    setAcceptedAgreements(prev => ({
      ...prev,
      [selectedAgreement.id]: true
    }));
  };

  const canAccept = hasScrolledToBottom[selectedAgreement.id] && !acceptedAgreements[selectedAgreement.id];

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
            <h2 className="text-3xl font-bold text-blue-600">Agreements</h2>
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
                onClick={() => onNavigate('users')}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all text-gray-600 hover:bg-blue-50 hover:text-blue-600"
              >
                <Users className="w-5 h-5" />
                <span>Users</span>
              </button>
              <button
                className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all bg-blue-600 text-white shadow-md transform scale-105"
              >
                <FileText className="w-5 h-5" />
                <span>Agreements</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column - Agreement List */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4">Required Agreements</h3>
            <div className="space-y-2 max-h-[calc(100vh-20rem)] overflow-y-auto">
              {mockAgreements.map((agreement) => (
                <div
                  key={agreement.id}
                  onClick={() => setSelectedAgreement(agreement)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    selectedAgreement.id === agreement.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className={`w-5 h-5 ${acceptedAgreements[agreement.id] ? 'text-green-500' : 'text-gray-400'}`} />
                      <div>
                        <h4 className="font-medium text-gray-900">{agreement.title}</h4>
                        <p className="text-sm text-gray-500">Last updated: Jan 31, 2024</p>
                      </div>
                    </div>
                    {acceptedAgreements[agreement.id] ? (
                      <div className="flex items-center text-green-600 text-sm font-medium">
                        <CheckCircle2 className="w-5 h-5 mr-1.5" />
                        Accepted
                      </div>
                    ) : (
                      <div className="flex items-center text-amber-600 text-sm font-medium">
                        <AlertCircle className="w-5 h-5 mr-1.5" />
                        Pending
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Agreement Content */}
          <div className="bg-white rounded-lg shadow flex flex-col">
            <div className="p-4 border-b flex-shrink-0">
              <h3 className="text-xl font-semibold">{selectedAgreement.title}</h3>
              <p className="text-sm text-gray-500 mt-1">Please read and accept the agreement below</p>
            </div>
            <div 
              className="p-4 overflow-y-auto flex-1 max-h-[calc(100vh-24rem)]"
              onScroll={handleScroll}
            >
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap font-sans">{selectedAgreement.content}</pre>
              </div>
            </div>
            <div className="p-4 border-t bg-gray-50 flex-shrink-0">
              <button
                onClick={handleAcceptAgreement}
                disabled={!canAccept}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  canAccept
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : acceptedAgreements[selectedAgreement.id]
                    ? 'bg-green-500 text-white cursor-default'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {acceptedAgreements[selectedAgreement.id]
                  ? 'Agreement Accepted'
                  : canAccept
                  ? 'Accept Agreement'
                  : 'Please read the entire agreement'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};