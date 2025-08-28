import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAppState } from "@/state/appState";
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PasscodeGenerator = () => {
  const { toast } = useToast();
  const addPasscode = useAppState((s) => s.addPasscode);
  const passcodes = useAppState((s) => s.passcodes);
  
  const [traineeEmail, setTraineeEmail] = useState("");
  const [customPasscode, setCustomPasscode] = useState("");
  const [expiryDays, setExpiryDays] = useState(7);

  // Generate a random passcode (if custom passcode is not provided)
  const generateRandomPasscode = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const handleGeneratePasscode = () => {
    if (!traineeEmail) {
      toast({ title: "Email required", description: "Please enter the trainee's email address." });
      return;
    }

    // Use custom passcode if provided, otherwise generate a random one
    const passcode = customPasscode || generateRandomPasscode();
    
    // Validate passcode format
    if (!/^\d+$/.test(passcode)) {
      toast({ title: "Invalid passcode", description: "Passcode must contain only digits." });
      return;
    }

    // Calculate expiry date
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + expiryDays);

    // Add passcode to state
    addPasscode(traineeEmail, passcode, expiryDate.toISOString());

    // Show success message
    toast({ 
      title: "Passcode generated", 
      description: `Passcode ${passcode} for ${traineeEmail} will expire in ${expiryDays} days.` 
    });

    // Reset form
    setTraineeEmail("");
    setCustomPasscode("");
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Trainee Passcode</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="traineeEmail">Trainee Email</Label>
            <Input
              id="traineeEmail"
              type="email"
              placeholder="trainee@example.com"
              value={traineeEmail}
              onChange={(e) => setTraineeEmail(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="customPasscode">Custom Passcode (Optional)</Label>
            <Input
              id="customPasscode"
              type="text"
              placeholder="Leave blank for random passcode"
              value={customPasscode}
              onChange={(e) => setCustomPasscode(e.target.value)}
              maxLength={10}
            />
            <p className="text-sm text-muted-foreground">
              If left blank, a random 4-digit passcode will be generated
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="expiryDays">Expiry (Days)</Label>
            <Input
              id="expiryDays"
              type="number"
              min={1}
              max={30}
              value={expiryDays}
              onChange={(e) => setExpiryDays(parseInt(e.target.value))}
            />
          </div>

          <Button onClick={handleGeneratePasscode} className="w-full">
            Generate Passcode
          </Button>
        </CardContent>
      </Card>

      {passcodes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Passcodes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>List of generated passcodes</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Trainee Email</TableHead>
                  <TableHead>Passcode</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Expires</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {passcodes.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{entry.traineeEmail}</TableCell>
                    <TableCell>{entry.code}</TableCell>
                    <TableCell>
                      {entry.isUsed ? (
                        <span className="text-muted-foreground">Used on {formatDate(entry.usedAt || "")}</span>
                      ) : (
                        <span className="text-green-500">Active</span>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(entry.createdAt)}</TableCell>
                    <TableCell>{formatDate(entry.expiresAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PasscodeGenerator;