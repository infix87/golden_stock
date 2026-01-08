module.exports = {
    apps: [
        {
            name: 'stock-backend',
            cwd: './backend',
            // 사용 중인 가상환경(venv)의 python 경로를 지정하는 것이 좋습니다.
            // 예(Linux): './venv/bin/python'
            // 예(Windows): '.\\venv\\Scripts\\python.exe'
            // 아래는 시스템 PATH에 있는 python을 사용합니다.
            script: 'python',
            args: '-m uvicorn main:app --host 0.0.0.0 --port 8000',
            autorestart: true,
            watch: false,
        },
        {
            name: 'stock-frontend',
            cwd: './frontend',
            script: 'npm',
            args: 'run dev -- --host',
            autorestart: true,
            watch: false,
        },
    ],
};
