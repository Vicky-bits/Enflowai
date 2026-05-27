let readyToAdopt = 'yes';

        function toggleDropdown(id, trigger) {
            document.querySelectorAll('.dropdown').forEach(d => {
                if (d.id !== id) d.classList.remove('open');
            });
            document.getElementById(id).classList.toggle('open');
        }

        function closeDropdown(id) {
            document.getElementById(id).classList.remove('open');
        }

        function selectOption(valueId, value, dropdownId) {
            document.getElementById(valueId).textContent = value;
            document.getElementById(valueId).classList.add('selected');
            setTimeout(() => closeDropdown(dropdownId), 150);
        }

        function setToggle(val) {
            readyToAdopt = val;
            document.getElementById('yesBtn').classList.toggle('active', val === 'yes');
            document.getElementById('noBtn').classList.toggle('active', val === 'no');
        }

        function submitForm() {
            const required = ['fullName', 'businessName', 'phone', 'email'];
            for (let id of required) {
                if (!document.getElementById(id).value.trim()) {
                    document.getElementById(id).focus();
                    document.getElementById(id).style.borderColor = '#ef4444';
                    setTimeout(() => document.getElementById(id).style.borderColor = '', 2000);
                    return;
                }
            }

            // Show spinner inside button
            const btn = document.getElementById('submitBtn');
            const btnText = document.getElementById('btnText');
            btn.disabled = true;
            btn.innerHTML = `
                <span style="display:flex;align-items:center;justify-content:center;gap:10px;">
                    <svg class="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                    </svg>
                    Submitting...
                </span>`;

            // After 2s transition to success
            setTimeout(() => {
                const card = document.getElementById('formCard');
                const success = document.getElementById('successCard');
                card.style.opacity = '0';
                card.style.transform = 'translateY(-16px)';
                setTimeout(() => {
                    card.style.display = 'none';
                    success.style.display = 'flex';
                    setTimeout(() => {
                        success.style.opacity = '1';
                        success.style.transform = 'translateY(0)';
                    }, 30);
                }, 350);
            }, 2000);
        }

        document.addEventListener('click', function(e) {
            if (!e.target.closest('.custom-select')) {
                document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open'));
            }
        });