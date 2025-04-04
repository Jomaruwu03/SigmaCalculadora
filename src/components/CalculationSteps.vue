<template>
    <div class="steps-details bg-white shadow-md rounded-lg p-4 border border-gray-200">
      <div v-if="steps" class="overflow-auto max-h-60 space-y-4">
        <div class="bg-gray-100 p-3 rounded-md hover:bg-gray-200 transition">
          <h4 class="text-blue-600 font-semibold">Método de Euler</h4>
          <table class="min-w-full border-collapse border border-gray-300">
            <tbody>
              <tr>
                <td class="border border-gray-300 p-2"><strong>y actual:</strong></td>
                <td class="border border-gray-300 p-2">{{ steps.eulerSteps.currentY.toFixed(4) }}</td>
              </tr>
              <tr>
                <td class="border border-gray-300 p-2"><strong>Pendiente:</strong></td>
                <td class="border border-gray-300 p-2">{{ steps.eulerSteps.slope.toFixed(4) }}</td>
              </tr>
              <tr>
                <td class="border border-gray-300 p-2"><strong>y siguiente:</strong></td>
                <td class="border border-gray-300 p-2">{{ steps.eulerSteps.nextY.toFixed(4) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
  
        <div class="bg-gray-100 p-3 rounded-md hover:bg-gray-200 transition">
          <h4 class="text-green-600 font-semibold">Euler Mejorado</h4>
          <table class="min-w-full border-collapse border border-gray-300">
            <tbody>
              <tr>
                <td class="border border-gray-300 p-2"><strong>k1:</strong></td>
                <td class="border border-gray-300 p-2">{{ steps.improvedSteps.k1.toFixed(4) }}</td>
              </tr>
              <tr>
                <td class="border border-gray-300 p-2"><strong>k2:</strong></td>
                <td class="border border-gray-300 p-2">{{ steps.improvedSteps.k2.toFixed(4) }}</td>
              </tr>
              <tr>
                <td class="border border-gray-300 p-2"><strong>Pendiente promedio:</strong></td>
                <td class="border border-gray-300 p-2">{{ steps.improvedSteps.averageSlope.toFixed(4) }}</td>
              </tr>
              <tr>
                <td class="border border-gray-300 p-2"><strong>y siguiente:</strong></td>
                <td class="border border-gray-300 p-2">{{ steps.improvedSteps.nextY.toFixed(4) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    props: {
      steps: {
        type: Object,
        required: true
      }
    }
  });
  </script>
  
  <style scoped>
  .steps-details {
    font-family: 'Arial', sans-serif;
  }
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th, td {
    text-align: left;
  }
  </style>