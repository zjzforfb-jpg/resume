/**
 * 张建宗 - AI技术工程师简历网站
 * 主要功能：主题切换、移动端菜单、平滑滚动、表单处理
 */

(function() {
    'use strict';

    // ========================================
    // 主题切换功能
    // ========================================
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    const themeIcon = themeToggle.querySelector('i');

    // 检查本地存储的主题设置
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        html.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    } else {
        // 检测系统偏好
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            html.setAttribute('data-theme', 'dark');
            updateThemeIcon('dark');
        }
    }

    // 主题切换事件
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    // 更新主题图标
    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }

    // ========================================
    // 移动端菜单
    // ========================================
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.querySelector('.nav-menu');

    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = mobileMenuToggle.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // 点击导航链接后关闭菜单
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const icon = mobileMenuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    // ========================================
    // 导航栏滚动效果
    // ========================================
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // 添加/移除滚动样式
        if (currentScroll > 50) {
            navbar.style.boxShadow = 'var(--shadow-md)';
        } else {
            navbar.style.boxShadow = 'none';
        }

        // 隐藏/显示导航栏
        if (currentScroll > lastScroll && currentScroll > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });

    // ========================================
    // 平滑滚动
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // 减去导航栏高度
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // 滚动显示动画
    // ========================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    // 观察元素
    document.querySelectorAll('.skill-category, .project-card, .timeline-item').forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });

    // ========================================
    // 联系表单处理 - Formspree
    // ========================================
    const contactForm = document.getElementById('contactForm');
    
    // 检查是否已配置 Formspree
    const formspreeAction = contactForm.getAttribute('action');
    const isFormspreeConfigured = formspreeAction && !formspreeAction.includes('YOUR_FORM_ID');

    if (isFormspreeConfigured) {
        // Formspree 会自动处理提交，不需要阻止默认行为
        // 只需要添加加载状态和成功提示
        contactForm.addEventListener('submit', () => {
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 发送中...';
            submitBtn.disabled = true;
            
            // Formspree 提交后会自动跳转或显示成功页面
            // 这里可以添加本地存储标记，用于返回后显示成功消息
            localStorage.setItem('formSubmitted', 'true');
        });
        
        // 检查是否从 Formspree 返回
        if (localStorage.getItem('formSubmitted') === 'true') {
            localStorage.removeItem('formSubmitted');
            showNotification('消息已发送成功！我会尽快回复您。', 'success');
            contactForm.reset();
        }
    } else {
        // 未配置 Formspree，显示提示
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('请先配置 Formspree 表单 ID', 'error');
        });
    }

    // 通知提示函数
    function showNotification(message, type = 'success') {
        // 移除现有的通知
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        // 添加样式
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 1rem 1.5rem;
            background-color: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            border-radius: 0.75rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-weight: 500;
            z-index: 9999;
            animation: slideIn 0.3s ease;
        `;

        // 添加动画样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // 3秒后自动移除
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // ========================================
    // 打字机效果（可选）
    // ========================================
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.textContent = '';
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }

    // 为副标题添加打字机效果
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        const originalText = heroSubtitle.textContent;
        
        // 使用 Intersection Observer 触发打字效果
        const subtitleObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typeWriter(heroSubtitle, originalText, 50);
                    subtitleObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        subtitleObserver.observe(heroSubtitle);
    }

    // ========================================
    // 技能条动画触发
    // ========================================
    // 先保存所有进度条的原始宽度
    document.querySelectorAll('.skill-progress').forEach(bar => {
        const width = bar.style.width;
        bar.setAttribute('data-width', width);
        bar.style.width = '0';
    });

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBars = entry.target.querySelectorAll('.skill-progress');
                progressBars.forEach((bar, index) => {
                    const width = bar.getAttribute('data-width');
                    if (width) {
                        setTimeout(() => {
                            bar.style.width = width;
                        }, index * 100);
                    }
                });
                
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.skill-category').forEach(category => {
        skillObserver.observe(category);
    });

    // ========================================
    // 项目卡片悬停效果增强
    // ========================================
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // ========================================
    // B站视频嵌入检测
    // ========================================
    function checkBilibiliEmbed() {
        const embeds = document.querySelectorAll('.bilibili-embed iframe');
        
        embeds.forEach(iframe => {
            // 检测iframe是否加载成功
            iframe.addEventListener('load', function() {
                // 尝试访问iframe内容，如果失败则显示备用链接
                try {
                    const iframeDoc = this.contentDocument || this.contentWindow.document;
                    // 如果能访问，说明加载成功
                } catch (e) {
                    // 跨域错误，显示备用链接
                    showVideoFallback(this);
                }
            });
            
            // 3秒后如果还没加载成功，显示备用链接
            setTimeout(() => {
                if (!iframe.dataset.loaded) {
                    showVideoFallback(iframe);
                }
            }, 3000);
        });
    }
    
    function showVideoFallback(iframe) {
        const wrapper = iframe.closest('.bilibili-embed');
        const fallback = wrapper.querySelector('.video-fallback');
        if (fallback) {
            fallback.style.display = 'flex';
            iframe.style.opacity = '0';
        }
    }
    
    // 页面加载完成后检测
    checkBilibiliEmbed();

    // ========================================
    // 视频播放控制
    // ========================================
    window.playVideo = function(button) {
        const card = button.closest('.project-card');
        const video = card.querySelector('.project-video');
        
        if (video) {
            if (video.paused) {
                // 先暂停其他视频
                document.querySelectorAll('.project-video').forEach(v => {
                    if (v !== video) {
                        v.pause();
                    }
                });
                
                video.play();
                button.innerHTML = '<i class="fas fa-pause"></i> 暂停';
            } else {
                video.pause();
                button.innerHTML = '<i class="fas fa-play"></i> 播放演示';
            }
            
            // 监听视频结束
            video.onended = function() {
                button.innerHTML = '<i class="fas fa-play"></i> 播放演示';
            };
        }
    };

    // 视频点击播放/暂停
    document.querySelectorAll('.project-video').forEach(video => {
        video.addEventListener('click', function() {
            const card = this.closest('.project-card');
            const button = card.querySelector('button[onclick="playVideo(this)"]');
            
            if (this.paused) {
                document.querySelectorAll('.project-video').forEach(v => {
                    if (v !== this) {
                        v.pause();
                        const otherCard = v.closest('.project-card');
                        const otherBtn = otherCard.querySelector('button[onclick="playVideo(this)"]');
                        if (otherBtn) {
                            otherBtn.innerHTML = '<i class="fas fa-play"></i> 播放演示';
                        }
                    }
                });
                
                this.play();
                if (button) {
                    button.innerHTML = '<i class="fas fa-pause"></i> 暂停';
                }
            } else {
                this.pause();
                if (button) {
                    button.innerHTML = '<i class="fas fa-play"></i> 播放演示';
                }
            }
        });
    });

    // ========================================
    // 统计数字动画
    // ========================================
    function animateNumber(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function update() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start) + '+';
                requestAnimationFrame(update);
            } else {
                element.textContent = target + '+';
            }
        }
        
        update();
    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.textContent);
                    animateNumber(stat, target);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        statsObserver.observe(heroStats);
    }

    // ========================================
    // 返回顶部按钮（可选）
    // ========================================
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTop.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--accent-gradient);
        color: white;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
        box-shadow: var(--shadow-lg);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
    `;

    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    console.log('🚀 张建宗简历网站已加载完成！');
    console.log('💡 功能：主题切换、移动端适配、平滑滚动、表单提交');
})();
