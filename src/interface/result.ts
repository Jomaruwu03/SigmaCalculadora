interface Result {
    x: number;
    yEuler: number;
    yImproved: number;
    eulerSteps: {
      currentY: number;
      slope: number;
      nextY: number;
    };
    improvedSteps: {
      k1: number;
      k2: number;
      averageSlope: number;
      nextY: number;
    };
  }