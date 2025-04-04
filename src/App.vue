<template>
  <div class="container mx-auto p-4 max-w-4xl font-digital">
    <div class="calculator-shell bg-gray-800 rounded-xl p-6 shadow-2xl border-4 border-gray-700">
      <div class="display bg-gray-100 p-4 rounded-lg mb-6 border-2 border-gray-400">
        <h1 class="text-2xl font-bold text-center text-gray-800 mb-2">MÉTODOS DE EULER</h1>
        <div class="text-right py-2 px-3 bg-gray-200 rounded border border-gray-300 text-gray-800 font-mono">
          {{ equation || "f(x,y) = ?" }}
        </div>
      </div>
      
      <div class="controls bg-gray-700 p-4 rounded-lg shadow-inner">
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div class="input-group">
            <label class="block text-gray-300 mb-1">x<sub>0</sub>:</label>
            <input type="number" v-model.number="x0" 
                   class="w-full p-2 rounded bg-gray-600 text-yellow-400 border border-gray-500 focus:border-yellow-400 focus:outline-none"/>
          </div>
          <div class="input-group">
            <label class="block text-gray-300 mb-1">y<sub>0</sub>:</label>
            <input type="number" v-model.number="y0" 
                   class="w-full p-2 rounded bg-gray-600 text-yellow-400 border border-gray-500 focus:border-yellow-400 focus:outline-none"/>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 mb-6">
          <div class="input-group">
            <label class="block text-gray-300 mb-1">Paso (h):</label>
            <input type="number" v-model.number="h" min="0.01" step="0.01"
                   class="w-full p-2 rounded bg-gray-600 text-yellow-400 border border-gray-500 focus:border-yellow-400 focus:outline-none"/>
          </div>
          <div class="input-group">
            <label class="block text-gray-300 mb-1">Puntos:</label>
            <input type="number" v-model.number="steps" min="1"
                   class="w-full p-2 rounded bg-gray-600 text-yellow-400 border border-gray-500 focus:border-yellow-400 focus:outline-none"/>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-gray-300 mb-1">Ecuación (y' = f(x,y)):</label>
          <input v-model="equation" placeholder="ej: x + y" 
                 class="w-full p-2 rounded bg-gray-600 text-yellow-400 border border-gray-500 focus:border-yellow-400 focus:outline-none"/>
        </div>

        <div class="flex gap-3 mt-6">
          <button @click="calculate" 
                  class="flex-1 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-4 rounded-lg shadow-md transition transform hover:scale-105 active:scale-95">
            CALCULAR
          </button>
          <button @click="showChart = !showChart" 
                  class="bg-gray-600 hover:bg-gray-500 text-gray-300 font-bold py-3 px-4 rounded-lg shadow-md transition transform hover:scale-105 active:scale-95">
            {{ showChart ? 'OCULTAR GRÁFICO' : 'MOSTRAR GRÁFICO' }}
          </button>
          <button @click="showTable = !showTable" 
                  class="bg-gray-600 hover:bg-gray-500 text-gray-300 font-bold py-3 px-4 rounded-lg shadow-md transition transform hover:scale-105 active:scale-95">
            {{ showTable ? 'OCULTAR TABLA' : 'MOSTRAR TABLA' }}
          </button>
        </div>
      </div>
      
      <div v-if="results.length > 0" class="mt-6">
        <div v-if="showTable" class="bg-gray-700 p-4 rounded-lg shadow-inner mb-4 transition-all duration-300">
          <h2 class="text-xl font-bold text-gray-300 mb-3 flex items-center">
            <span class="icon mr-2">📋</span> RESULTADOS
          </h2>
          <div class="overflow-auto max-h-80">
            <table class="w-full border-collapse">
              <thead>
                <tr class="bg-gray-600 text-yellow-400">
                  <th class="p-2 border border-gray-500">x</th>
                  <th class="p-2 border border-gray-500">y (Euler)</th>
                  <th class="p-2 border border-gray-500">y (Euler Mejorado)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(result, index) in results" :key="index" 
                    :class="index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'">
                  <td class="p-2 border border-gray-600 text-gray-300 text-center">{{ result.x.toFixed(2) }}</td>
                  <td class="p-2 border border-gray-600 text-yellow-400 text-center">{{ result.yEuler.toFixed(4) }}</td>
                  <td class="p-2 border border-gray-600 text-green-400 text-center">{{ result.yImproved.toFixed(4) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-if="showChart" class="bg-gray-700 p-4 rounded-lg shadow-inner transition-all duration-300">
          <h2 class="text-xl font-bold text-gray-300 mb-3 flex items-center">
            <span class="icon mr-2">📈</span> GRÁFICO
          </h2>
          <div class="chart-container relative h-80">
            <canvas ref="canvas" class="bg-gray-800 rounded border border-gray-600"></canvas>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface Result {
  x: number;
  yEuler: number;
  yImproved: number;
}

export default defineComponent({
  data() {
    return {
      equation: 'x + y',
      x0: 0,
      y0: 1,
      h: 0.1,
      steps: 10,
      results: [] as Result[],
      chart: null as Chart | null,
      showChart: true,
      showTable: true
    };
  },
  methods: {
    f(x: number, y: number): number {
      try {
        return new Function('x', 'y', `return ${this.equation};`)(x, y);
      } catch (e) {
        alert('Error en la ecuación');
        return 0;
      }
    },

    calculate() {
      this.results = [];
      let x = this.x0;
      let yEuler = this.y0;
      let yImproved = this.y0;

      for (let i = 0; i < this.steps; i++) {
        const slopeEuler = this.f(x, yEuler);
        const eulerSteps = { nextY: yEuler + this.h * slopeEuler };
        const k1 = this.f(x, yImproved);
        const k2 = this.f(x + this.h, yImproved + this.h * k1);
        const averageSlope = (k1 + k2) / 2;
        const improvedSteps = { nextY: yImproved + this.h * averageSlope };

        this.results.push({ x, yEuler, yImproved });
        yEuler = eulerSteps.nextY;
        yImproved = improvedSteps.nextY;
        x += this.h;
      }
      this.drawGraph();
    },

    drawGraph() {
      if (this.chart) this.chart.destroy();
      const canvas = this.$refs.canvas as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const labels = this.results.map(r => r.x.toFixed(2));
      const eulerData = this.results.map(r => r.yEuler);
      const improvedData = this.results.map(r => r.yImproved);

      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            { 
              label: 'Método de Euler', 
              data: eulerData, 
              borderColor: '#f59e0b', 
              backgroundColor: 'rgba(245, 158, 11, 0.1)', 
              borderWidth: 2,
              pointBackgroundColor: '#f59e0b',
              pointRadius: 4,
              tension: 0.1 
            },
            { 
              label: 'Euler Mejorado', 
              data: improvedData, 
              borderColor: '#10b981', 
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              borderWidth: 2,
              pointBackgroundColor: '#10b981',
              pointRadius: 4,
              tension: 0.1 
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: '#e5e7eb',
                font: {
                  family: "'Courier New', monospace",
                  size: 14
                }
              }
            },
            tooltip: {
              backgroundColor: '#1f2937',
              titleColor: '#f59e0b',
              bodyColor: '#e5e7eb',
              borderColor: '#4b5563',
              borderWidth: 1,
              padding: 10,
              usePointStyle: true
            }
          },
          scales: {
            x: { 
              title: { 
                display: true, 
                text: 'x',
                color: '#9ca3af',
                font: {
                  family: "'Courier New', monospace",
                  size: 14
                }
              },
              grid: {
                color: '#4b5563'
              },
              ticks: {
                color: '#9ca3af'
              }
            },
            y: { 
              title: { 
                display: true, 
                text: 'y',
                color: '#9ca3af',
                font: {
                  family: "'Courier New', monospace",
                  size: 14
                }
              },
              grid: {
                color: '#4b5563'
              },
              ticks: {
                color: '#9ca3af'
              }
            }
          }
        }
      });
    }
  }
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

.container {
  background-color: #0d1b2a; /* Azul oscuro retro */
  min-height: 100vh;
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.font-digital {
  font-family: 'Share Tech Mono', monospace;
}

.calculator-shell {
  background-color: #1b263b; /* Azul más claro */
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5), 
              inset 0 -5px 20px rgba(0, 0, 0, 0.3);
  border-color: #415a77; /* Azul intermedio */
}

.display {
  background-color: #1b263b; /* Fondo claro para contraste */
  color: #1b263b; /* Azul oscuro para texto */
  box-shadow: inset 0 4px 8px rgba(0, 0, 0, 0.2);
}

.controls {
  background-color: #1b263b; /* Azul más claro */
  box-shadow: inset 0 4px 8px rgba(0, 0, 0, 0.3);
}

button {
  transition: all 0.2s ease;
  text-transform: uppercase;
  background-color: #778da9; /* Azul claro */
  color: #e0e1dd; /* Texto claro */
  border: 2px solid #415a77; /* Azul intermedio */
}

button:hover {
  background-color: #415a77; /* Azul intermedio */
  color: #e0e1dd; /* Texto claro */
}

button:active {
  transform: scale(0.95);
}

input {
  background-color: #1b263b; /* Azul más claro */
  color: #e0e1dd; /* Texto claro */
  border: 2px solid #415a77; /* Azul intermedio */
  padding: 0.5rem;
  border-radius: 5px;
}

input:focus {
  outline: none;
  border-color: #778da9; /* Azul claro */
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
  appearance: textfield;
}

.chart-container {
  position: relative;
  margin: auto;
  background-color: #1b263b; /* Azul más claro */
  border: 2px solid #415a77; /* Azul intermedio */
  border-radius: 10px;
  padding: 1rem;
}

h1, h2, h3, h4, h5, h6 {
  color: #e0e1dd; /* Texto claro */
}

label {
  color: #e0e1dd; /* Texto claro */
}

table {
  background-color: #1b263b; /* Azul más claro */
  color: #e0e1dd; /* Texto claro */
  border-collapse: collapse;
  width: 100%;
}

th, td {
  border: 1px solid #415a77; /* Azul intermedio */
  padding: 0.5rem;
  text-align: center;
}

th {
  background-color: #415a77; /* Azul intermedio */
  color: #e0e1dd; /* Texto claro */
}

tr:nth-child(even) {
  background-color: #0d1b2a; /* Azul oscuro retro */
}

tr:nth-child(odd) {
  background-color: #1b263b; /* Azul más claro */
}

.icon {
  color: #778da9; /* Azul claro */
}

.tooltip {
  background-color: #1b263b; /* Azul más claro */
  color: #e0e1dd; /* Texto claro */
  border: 1px solid #415a77; /* Azul intermedio */
  padding: 0.5rem;
  border-radius: 5px;
}
</style>