import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert.jsx";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import "./App.css";

function App() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(10);
  const [prevStats, setPrevStats] = useState(null);

  const fetchStats = () => {
    fetch("https://en.wikipedia.org/w/api.php?action=query&format=json&meta=siteinfo&siprop=statistics&origin=*")
      .then(response => response.json())
      .then(data => {
        setPrevStats(stats);
        setStats(data.query.statistics);
      })
      .catch(error => setError(error));
  };

  useEffect(() => {
    fetchStats(); // Initial fetch

    const interval = setInterval(() => {
      fetchStats();
    }, 10000); // Fetch every 10 seconds

    const countdownInterval = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 10));
    }, 1000); // Countdown every second

    return () => {
      clearInterval(interval);
      clearInterval(countdownInterval);
    };
  }, []);

  const getStatChange = (current, previous) => {
    if (previous === null) return null;
    if (current > previous) return { color: "text-green-600", icon: <ArrowUp /> };
    if (current < previous) return { color: "text-red-600", icon: <ArrowDown /> };
    return { color: "text-gray-600", icon: <Minus /> };
  };

  const formatTitle = (title) => {
    return title
      .replace(/-/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  };

  return (
    <div className="App">
      <Card>
        <CardHeader>
          <CardTitle>Wikipedia Live Stats</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          ) : stats ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.keys(stats).filter(key => key !== 'jobs' && key !== 'queued-massmessages').map((key) => {
                const change = getStatChange(stats[key], prevStats ? prevStats[key] : null);
                return (
                  <Card key={key} className="flex flex-col items-center">
                    <CardTitle>{formatTitle(key)}</CardTitle>
                    <CardContent className="flex items-center">
                      <span className="text-2xl">{stats[key]}</span>
                      {change && (
                        <span className={`ml-2 ${change.color}`}>
                          {change.icon}
                        </span>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
              <Card className="flex flex-col items-center">
                <CardTitle>Next refresh in</CardTitle>
                <CardContent className="text-2xl">{countdown} seconds</CardContent>
              </Card>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </CardContent>
      </Card>
      <Button onClick={fetchStats} className="mt-4">Refresh Now</Button>
    </div>
  );
}

export default App;