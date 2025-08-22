document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navList = document.querySelector('.nav-list');
    
    if (hamburger && navList) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navList.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navList.classList.contains('active')) {
                hamburger.classList.remove('active');
                navList.classList.remove('active');
            }
        });
    });
    
    // Animate skill bars on scroll
    const skillBars = document.querySelectorAll('.skill-level');
    if (skillBars.length > 0) {
        const animateSkillBars = () => {
            skillBars.forEach(bar => {
                const level = bar.getAttribute('data-level');
                bar.style.width = level + '%';
            });
        };
        
        // Check if element is in viewport
        const isInViewport = (element) => {
            const rect = element.getBoundingClientRect();
            return (
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.bottom >= 0
            );
        };
        
        // Run animation when skills section is in view
        const skillsSection = document.querySelector('.about-skills');
        if (skillsSection) {
            const checkSkillsVisibility = () => {
                if (isInViewport(skillsSection)) {
                    animateSkillBars();
                    window.removeEventListener('scroll', checkSkillsVisibility);
                }
            };
            
            window.addEventListener('scroll', checkSkillsVisibility);
            // Check on initial load
            checkSkillsVisibility();
        }
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formMessage = document.getElementById('form-message');
            const formData = new FormData(this);
            
            // Simulate form submission
            setTimeout(() => {
                formMessage.textContent = 'Thank you for your message! I will get back to you soon.';
                formMessage.classList.add('success');
                contactForm.reset();
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    formMessage.classList.remove('success');
                    formMessage.textContent = '';
                }, 5000);
            }, 1000);
        });
    }
    
    // Load featured projects
    const featuredProjectsContainer = document.getElementById('featured-projects');
    if (featuredProjectsContainer) {
        fetch('data/projects.json')
            .then(response => response.json())
            .then(projects => {
                // Filter featured projects
                const featuredProjects = projects.filter(project => project.featured);
                // Display only 3 featured projects
                const limitedProjects = featuredProjects.slice(0, 3);
                
                limitedProjects.forEach(project => {
                    const projectCard = createProjectCard(project);
                    featuredProjectsContainer.appendChild(projectCard);
                });
            })
            .catch(error => console.error('Error loading projects:', error));
    }
    
    // Load all projects for projects page
    const projectsGrid = document.getElementById('projects-grid');
    if (projectsGrid) {
        fetch('data/projects.json')
            .then(response => response.json())
            .then(projects => {
                projects.forEach(project => {
                    const projectCard = createProjectCard(project);
                    projectsGrid.appendChild(projectCard);
                });
                
                // Add click event to project cards to open modal
                const projectCards = document.querySelectorAll('.project-card');
                projectCards.forEach(card => {
                    card.addEventListener('click', function() {
                        const projectId = this.getAttribute('data-id');
                        const project = projects.find(p => p.id == projectId);
                        openProjectModal(project);
                    });
                });
            })
            .catch(error => console.error('Error loading projects:', error));
    }
    
    // Create project card element
    function createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.setAttribute('data-id', project.id);
        card.setAttribute('data-category', project.category);
        
        card.innerHTML = `
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}">
            </div>
            <div class="project-info">
                <h3 class="project-title">${project.title}</h3>
                <span class="project-category">${project.category}</span>
                <p class="project-description">${project.shortDescription}</p>
            </div>
        `;
        
        return card;
    }
    
    // Open project modal
    function openProjectModal(project) {
        const modal = document.getElementById('project-modal');
        const modalImg = document.getElementById('modal-img');
        const modalTitle = document.getElementById('modal-title');
        const modalCategory = document.getElementById('modal-category');
        const modalDescription = document.getElementById('modal-description');
        const modalTechList = document.getElementById('modal-tech-list');
        const modalLiveLink = document.getElementById('modal-live-link');
        const modalCodeLink = document.getElementById('modal-code-link');
        
        modalImg.src = project.image;
        modalImg.alt = project.title;
        modalTitle.textContent = project.title;
        modalCategory.textContent = project.category;
        modalDescription.textContent = project.description;
        
        // Clear previous tech list
        modalTechList.innerHTML = '';
        
        // Add tech items
        project.technologies.forEach(tech => {
            const li = document.createElement('li');
            li.textContent = tech;
            modalTechList.appendChild(li);
        });
        
        // Set links
        modalLiveLink.href = project.liveLink || '#';
        modalCodeLink.href = project.codeLink || '#';
        
        // Show modal
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Close modal when clicking close button
        const closeBtn = document.getElementById('modal-close');
        closeBtn.addEventListener('click', closeModal);
        
        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        function closeModal() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
});