import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAppState } from '@/state/appState';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, CheckCircle, XCircle, UserCheck, FileCheck, Camera } from 'lucide-react';
import FormField from '@/components/FormField';
import FileUploadField from '@/components/FileUploadField';

// Interface for trainee data
interface Trainee {
  id: string;
  email: string;
  name: string;
  company: string;
  passcode: string;
  verificationStatus: 'unverified' | 'verified' | 'rejected';
  verificationMethod?: 'nin' | 'driversLicense' | 'workId';
  verificationId?: string;
  verificationDate?: string;
  verificationImage?: string;
  verifiedBy?: string;
}

const DeskOfficerVerification: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = useAppState((s) => s.user);
  
  // Mock data for trainees
  const [trainees, setTrainees] = useState<Trainee[]>([
    { 
      id: '1', 
      email: 'trainee1@example.com', 
      name: 'John Doe', 
      company: 'ABC Corp', 
      passcode: '1234',
      verificationStatus: 'unverified'
    },
    { 
      id: '2', 
      email: 'trainee2@example.com', 
      name: 'Jane Smith', 
      company: 'XYZ Ltd', 
      passcode: '5678',
      verificationStatus: 'verified',
      verificationMethod: 'nin',
      verificationId: '12345678901',
      verificationDate: '2025-08-25T10:30:00Z',
      verifiedBy: 'Desk Officer'
    },
    { 
      id: '3', 
      email: 'trainee3@example.com', 
      name: 'Robert Johnson', 
      company: 'ABC Corp', 
      passcode: '9012',
      verificationStatus: 'unverified'
    },
    { 
      id: '4', 
      email: 'trainee4@example.com', 
      name: 'Emily Davis', 
      company: 'DEF Inc', 
      passcode: '3456',
      verificationStatus: 'rejected'
    },
  ]);
  
  // State for search and verification
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrainee, setSelectedTrainee] = useState<Trainee | null>(null);
  const [isVerificationDialogOpen, setIsVerificationDialogOpen] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [isPasscodeVerified, setIsPasscodeVerified] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState<'nin' | 'driversLicense' | 'workId'>('nin');
  const [verificationId, setVerificationId] = useState('');
  const [verificationImage, setVerificationImage] = useState<File | null>(null);
  const [verificationImageUrl, setVerificationImageUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Filter trainees based on search query
  const filteredTrainees = trainees.filter(trainee => 
    trainee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trainee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trainee.company.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Start verification process for a trainee
  const startVerification = (trainee: Trainee) => {
    setSelectedTrainee(trainee);
    setPasscodeInput('');
    setIsPasscodeVerified(false);
    setVerificationMethod('nin');
    setVerificationId('');
    setVerificationImage(null);
    setVerificationImageUrl(null);
    setIsVerificationDialogOpen(true);
  };
  
  // Verify trainee passcode
  const verifyPasscode = () => {
    if (!selectedTrainee) return;
    
    if (passcodeInput === selectedTrainee.passcode) {
      setIsPasscodeVerified(true);
      toast({
        title: 'Passcode Verified',
        description: 'Please proceed with identity verification',
      });
    } else {
      toast({
        title: 'Invalid Passcode',
        description: 'The passcode entered is incorrect',
        variant: 'destructive',
      });
    }
  };
  
  // Handle verification image upload
  const handleImageUpload = (file: File | null, dataUrl: string | null | undefined) => {
    setVerificationImage(file);
    setVerificationImageUrl(dataUrl || null);
  };
  
  // Submit verification
  const submitVerification = () => {
    if (!selectedTrainee || !isPasscodeVerified) return;
    
    if (!verificationId) {
      toast({
        title: 'ID Required',
        description: 'Please enter the identification number',
        variant: 'destructive',
      });
      return;
    }
    
    if (!verificationImage) {
      toast({
        title: 'Image Required',
        description: 'Please upload an image of the identification',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // Update trainee verification status
      const updatedTrainees = trainees.map(trainee => 
        trainee.id === selectedTrainee.id
          ? {
              ...trainee,
              verificationStatus: 'verified',
              verificationMethod,
              verificationId,
              verificationDate: new Date().toISOString(),
              verificationImage: verificationImageUrl,
              verifiedBy: user?.name || 'Desk Officer',
            }
          : trainee
      );
      
      setTrainees(updatedTrainees);
      
      toast({
        title: 'Verification Successful',
        description: `${selectedTrainee.name} has been verified successfully`,
      });
      
      setIsSubmitting(false);
      setIsVerificationDialogOpen(false);
    }, 1500);
  };
  
  // Reject verification
  const rejectVerification = () => {
    if (!selectedTrainee) return;
    
    // Update trainee verification status
    const updatedTrainees = trainees.map(trainee => 
      trainee.id === selectedTrainee.id
        ? {
            ...trainee,
            verificationStatus: 'rejected',
          }
        : trainee
    );
    
    setTrainees(updatedTrainees);
    
    toast({
      title: 'Verification Rejected',
      description: `${selectedTrainee.name}'s verification has been rejected`,
    });
    
    setIsVerificationDialogOpen(false);
  };
  
  // Get status badge for trainee
  const getStatusBadge = (status: Trainee['verificationStatus']) => {
    switch (status) {
      case 'verified':
        return (
          <Badge className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Unverified
          </Badge>
        );
    }
  };
  
  return (
    <div className="container mx-auto py-8">
      <Helmet>
        <title>Trainee Verification | Alpatech Training Portal</title>
        <meta name="description" content="Verify trainee identities and credentials" />
      </Helmet>
      
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Trainee Verification</h1>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Trainees</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name, email, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Trainees</TabsTrigger>
          <TabsTrigger value="unverified">Unverified</TabsTrigger>
          <TabsTrigger value="verified">Verified</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <TraineeList 
            trainees={filteredTrainees} 
            onVerify={startVerification} 
            getStatusBadge={getStatusBadge}
          />
        </TabsContent>
        
        <TabsContent value="unverified">
          <TraineeList 
            trainees={filteredTrainees.filter(t => t.verificationStatus === 'unverified')} 
            onVerify={startVerification} 
            getStatusBadge={getStatusBadge}
          />
        </TabsContent>
        
        <TabsContent value="verified">
          <TraineeList 
            trainees={filteredTrainees.filter(t => t.verificationStatus === 'verified')} 
            onVerify={startVerification} 
            getStatusBadge={getStatusBadge}
          />
        </TabsContent>
        
        <TabsContent value="rejected">
          <TraineeList 
            trainees={filteredTrainees.filter(t => t.verificationStatus === 'rejected')} 
            onVerify={startVerification} 
            getStatusBadge={getStatusBadge}
          />
        </TabsContent>
      </Tabs>
      
      {/* Verification Dialog */}
      <Dialog open={isVerificationDialogOpen} onOpenChange={setIsVerificationDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Verify Trainee Identity</DialogTitle>
            <DialogDescription>
              {selectedTrainee?.name} - {selectedTrainee?.email}
            </DialogDescription>
          </DialogHeader>
          
          {!isPasscodeVerified ? (
            <div className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="passcode">Enter Trainee Passcode</Label>
                <Input 
                  id="passcode" 
                  value={passcodeInput} 
                  onChange={(e) => setPasscodeInput(e.target.value)} 
                  placeholder="Enter the 4-digit passcode"
                  type="password"
                />
                <p className="text-sm text-muted-foreground">
                  Ask the trainee for their unique passcode to verify their identity
                </p>
              </div>
              
              <Button onClick={verifyPasscode} className="w-full">
                Verify Passcode
              </Button>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="verificationMethod">Verification Method</Label>
                <Select 
                  value={verificationMethod} 
                  onValueChange={(value) => setVerificationMethod(value as any)}
                >
                  <SelectTrigger id="verificationMethod">
                    <SelectValue placeholder="Select verification method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nin">National ID (NIN)</SelectItem>
                    <SelectItem value="driversLicense">Driver's License</SelectItem>
                    <SelectItem value="workId">Work ID</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <FormField
                label="ID Number"
                name="verificationId"
                placeholder="Enter the identification number"
                value={verificationId}
                onChange={(e) => setVerificationId(e.target.value)}
                required
              />
              
              <FileUploadField
                label="ID Image"
                name="verificationImage"
                accept="image/*"
                maxSizeInKB={500}
                value={verificationImage}
                dataUrl={verificationImageUrl}
                onChange={handleImageUpload}
                required
                showPreview
              />
              
              <div className="flex gap-2 pt-4">
                <Button 
                  variant="destructive" 
                  onClick={rejectVerification}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
                <Button 
                  onClick={submitVerification}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    "Processing..."
                  ) : (
                    <>
                      <UserCheck className="h-4 w-4 mr-1" />
                      Verify
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Trainee list component
interface TraineeListProps {
  trainees: Trainee[];
  onVerify: (trainee: Trainee) => void;
  getStatusBadge: (status: Trainee['verificationStatus']) => React.ReactNode;
}

const TraineeList: React.FC<TraineeListProps> = ({ trainees, onVerify, getStatusBadge }) => {
  if (trainees.length === 0) {
    return (
      <Card className="bg-muted/50">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileCheck className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No Trainees Found</h3>
          <p className="text-muted-foreground">
            No trainees match your current filters
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {trainees.map(trainee => (
        <Card key={trainee.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{trainee.name}</CardTitle>
              {getStatusBadge(trainee.verificationStatus)}
            </div>
            <p className="text-sm text-muted-foreground">{trainee.email}</p>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-sm"><strong>Company:</strong> {trainee.company}</p>
            {trainee.verificationStatus === 'verified' && (
              <>
                <p className="text-sm mt-2">
                  <strong>Verified via:</strong> {
                    trainee.verificationMethod === 'nin' ? 'National ID' :
                    trainee.verificationMethod === 'driversLicense' ? 'Driver\'s License' :
                    'Work ID'
                  }
                </p>
                <p className="text-sm">
                  <strong>Verified on:</strong> {
                    trainee.verificationDate ? 
                    new Date(trainee.verificationDate).toLocaleDateString() : 
                    'Unknown'
                  }
                </p>
              </>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              variant={trainee.verificationStatus === 'verified' ? 'outline' : 'default'} 
              size="sm" 
              className="w-full"
              onClick={() => onVerify(trainee)}
            >
              {trainee.verificationStatus === 'verified' ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  View Details
                </>
              ) : trainee.verificationStatus === 'rejected' ? (
                <>
                  <UserCheck className="h-4 w-4 mr-1" />
                  Verify Again
                </>
              ) : (
                <>
                  <Camera className="h-4 w-4 mr-1" />
                  Verify Now
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default DeskOfficerVerification;