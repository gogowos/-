<template>
  <canvas id="polarChart"></canvas>
</template>

<script>
import { Chart, registerables } from 'chart.js';
import config from '../config.js';

Chart.register(...registerables);

export default {
  name: 'polarchart',
  data() {
    return {
      configdata: config,
      skills: null,
      skillPoints: null,
    };
  },
  mounted() {
    if (import.meta.env.VITE_CONFIG) {
      this.configdata = JSON.parse(import.meta.env.VITE_CONFIG);
    }
    this.skills = this.configdata.polarChart.skills;
    this.skillPoints = this.configdata.polarChart.skillPoints;
    this.renderChart();
  },
  methods: {
    generateColors(count) {
      const baseColors = [
        'rgba(255, 107, 109, 0.6)',
        'rgba(255, 215, 0, 0.6)',
        'rgba(107, 203, 119, 0.6)',
        'rgba(77, 150, 255, 0.6)',
        'rgba(255, 107, 205, 0.6)',
        'rgba(255, 159, 67, 0.6)',
        'rgba(165, 94, 234, 0.6)',
        'rgba(46, 213, 115, 0.6)',
        'rgba(255, 99, 72, 0.6)',
        'rgba(123, 237, 159, 0.6)',
      ];
      const colors = [];
      for (let i = 0; i < count; i++) {
        colors.push(baseColors[i % baseColors.length]);
      }
      return colors;
    },
    renderChart() {
      const canvas = document.getElementById('polarChart');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const colors = this.generateColors(this.skills.length);
      new Chart(ctx, {
        type: 'polarArea',
        data: {
          labels: this.skills,
          datasets: [{
            label: '幸福指数',
            data: this.skillPoints,
            backgroundColor: colors,
            borderColor: colors.map(color => color.replace('0.6', '1')),
            borderWidth: 2,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              backgroundColor: 'rgba(40, 40, 40, 0.7)',
              titleColor: '#fff',
              bodyColor: '#fff',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              borderWidth: 2,
              padding: 10,
              caretSize: 6,
              caretPadding: 8,
              cornerRadius: 6,
              boxWidth: 10,
              boxHeight: 10,
              displayColors: true,
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.raw || '';
                  return `${label}: ${value} 分`;
                },
                title: function(context) {
                  return `${context[0].label}`;
                },
              },
            },
          },
          scales: {
            r: {
              ticks: {
                display: false,
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.1)',
                lineWidth: 0.5,
              },
              angleLines: {
                color: 'rgba(255, 255, 255, 0.2)',
                lineWidth: 1,
              },
            },
          },
          animation: {
            duration: 1800,
            easing: 'easeOutQuad',
            animateRotate: true,
            animateScale: true,
          },
        },
      });
    },
  },
};
</script>

<style scoped>
canvas {
  width: 100%;
  height: 100%;
}
</style>
