import React from 'react';
import { motion } from 'framer-motion';
import { Star, GitFork, Users, Code } from 'lucide-react';
import { GitHubStats as GitHubStatsType } from './services/githubService';
import './GitHubStats.css';

interface GitHubStatsProps {
    stats: GitHubStatsType | null;
    isLoading: boolean;
}

const GitHubStats: React.FC<GitHubStatsProps> = ({ stats, isLoading }) => {
    if (isLoading) {
        return (
            <div className="github-stats-container">
                <motion.div
                    className="github-stats-loading"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    <Code size={32} color="#00ffff" />
                    <p>Loading GitHub stats...</p>
                </motion.div>
            </div>
        );
    }

    if (!stats) {
        return null;
    }

    const statsData = [
        {
            icon: <Code size={24} />,
            value: stats.totalRepos,
            label: 'Repositories',
            color: '#00ffff',
        },
        {
            icon: <Star size={24} />,
            value: stats.totalStars,
            label: 'Total Stars',
            color: '#ffd700',
        },
        {
            icon: <GitFork size={24} />,
            value: stats.totalForks,
            label: 'Total Forks',
            color: '#ff6b6b',
        },
        {
            icon: <Users size={24} />,
            value: stats.followers,
            label: 'Followers',
            color: '#4ecdc4',
        },
    ];

    return (
        <div className="github-stats-container">
            <motion.h4
                className="github-stats-title"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
            >
                GitHub Activity
            </motion.h4>
            <div className="github-stats-grid">
                {statsData.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        className="github-stat-card"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                        viewport={{ once: true }}
                    >
                        <div className="github-stat-icon" style={{ color: stat.color }}>
                            {stat.icon}
                        </div>
                        <div className="github-stat-value">{stat.value}+</div>
                        <div className="github-stat-label">{stat.label}</div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default GitHubStats;
