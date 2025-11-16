export default function CircleBackground() {
    return (
      <div className="bottom-0 left-0 overflow-hidden fixed right-0 top-0 -z-1">
        <div className="circle1 rounded-full blur-[80px] h-[100vmax] left-[40%] mix-blend-screen absolute top-[-80vmax] w-[100vmax]"></div>
        <div className="circle2 rounded-full blur-[80px] h-[100vmax] left-[40%] mix-blend-screen absolute top-[-80vmax] w-[100vmax]"></div>
        <div className="circle3 rounded-full blur-[80px] h-[100vmax] left-[40%] mix-blend-screen absolute top-[-80vmax] w-[100vmax]"></div>
      </div>
    );
  }
  