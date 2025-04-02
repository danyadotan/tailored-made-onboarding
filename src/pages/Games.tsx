
import { MainLayout } from "@/components/MainLayout";
import { DrawMonster } from "@/components/games/DrawMonster";
import { ExecutiveGame } from "@/components/games/ExecutiveGame";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Games = () => {
  return (
    <MainLayout>
      <div className="p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">ADHD Interactive Games</h1>
          <p className="text-muted-foreground mb-6">
            Games can help process emotions and develop coping skills. Have fun with these therapeutic activities!
          </p>
          
          <Tabs defaultValue="monster" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="monster">Draw Your Monster</TabsTrigger>
              <TabsTrigger value="executive">Executive (Ass)hole Game</TabsTrigger>
            </TabsList>
            <TabsContent value="monster" className="mt-6">
              <DrawMonster />
            </TabsContent>
            <TabsContent value="executive" className="mt-6">
              <ExecutiveGame />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default Games;
