import json, glob, os, collections, re
SP = os.environ.get('SP', '/private/tmp/claude-501/-Users-leocarreto/07e76b62-6eab-4df9-87c7-f6eb4d86f5b1/scratchpad')
for f in sorted(glob.glob(SP + '/pw/out/*.json')):
    d = json.load(open(f))
    print('\n=====', d['device'], d['scheme'])
    for k in ['errors', 'rejections', 'console', 'failed', 'clickFail']:
        if d[k]: print(' ', k, sorted(set(d[k]))[:8])
    print('  perf', d['perf'], 'listeners', d['listeners'])
    for s in d['steps']:
        if 'FALLA' in s or s.startswith('  '): print('  ', s[:220])
    agg = collections.defaultdict(set)
    for m in d['measures']:
        sc = m['screen']
        if m['hscroll']: agg['scroll horizontal'].add(f"{sc}:{m['hscroll']}px")
        for k in ['small', 'clipped', 'offscreen', 'overlaps', 'dupIds']:
            for x in m[k]: agg[k].add(re.sub(r'«.*?»', lambda z: z.group(0)[:30], x) + '  @' + sc[:2])
        M = m.get('map')
        if M:
            for k in ['labelOverlap', 'labelOnBuilding', 'labelCut', 'labelUnderUI', 'rumboOnBuilding']:
                for x in M[k]: agg['mapa.' + k].add(x + ' @' + sc[:2])
            agg['mapa.edificios<110'].add(sc[:2] + ': ' + str(len(M['small'])) + '/' + str(len(M['heights'])) + ' alturas ' + str(sorted(M['heights'].values())[:3]) + '…' + str(sorted(M['heights'].values())[-1:]))
            if M.get('navCut'): agg['mapa.navCut'].add(sc + ' bottom ' + str(M['navBottom']) + ' H ' + str(m['H']))
            agg['mapa.navBtns'].add(M.get('navBtns', ''))
    for k, v in agg.items():
        v = sorted(v); print(f'  [{k}] {len(v)}')
        # agrupa por texto sin pantalla
        g = collections.OrderedDict()
        for x in v:
            base, _, sc = x.rpartition(' @') if ' @' in x else (x, '', '')
            base = base.strip(); g.setdefault(base, []).append(sc)
        for b, scs in list(g.items())[:14]: print('     ', b[:150], '(' + ','.join(scs)[:40] + ')')
